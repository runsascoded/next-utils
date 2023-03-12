/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import {AsyncDuckDB, DuckDBBundle} from "@duckdb/duckdb-wasm";

import {Table} from "apache-arrow";
import Worker from 'web-worker';
import path from "path"
import {useEffect, useState} from "react";

export type DuckConn = {
  db: duckdb.AsyncDuckDB;
  conn: duckdb.AsyncDuckDBConnection;
  worker: Worker;
};

const ENABLE_DUCK_LOGGING = false;

const SilentLogger = {
  log: () => {
    /* do nothing */
  },
};

// TODO: shut DB down at some point

let duckConn: DuckConn;
let initialize: Promise<DuckConn>;

type WorkerBundle = { bundle: DuckDBBundle, worker: Worker }
export async function nodeWorkerBundle(): Promise<WorkerBundle> {
  const DUCKDB_DIST = `node_modules/@duckdb/duckdb-wasm/dist`
  const bundle = await duckdb.selectBundle({
    mvp: {
      mainModule: path.resolve(DUCKDB_DIST, './duckdb-mvp.wasm'),
      mainWorker: path.resolve(DUCKDB_DIST, './duckdb-node-mvp.worker.cjs'),
    },
    eh: {
      mainModule: path.resolve(DUCKDB_DIST, './duckdb-eh.wasm'),
      mainWorker: path.resolve(DUCKDB_DIST, './duckdb-node-eh.worker.cjs'),
    },
  });
  const mainWorker = bundle.mainWorker
  if (mainWorker) {
    const worker = new Worker(mainWorker);
    return { bundle, worker }
  } else {
    throw Error(`No mainWorker: ${mainWorker}`)
  }
}

export async function browserWorkerBundle(): Promise<WorkerBundle> {
  const allBundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(allBundles);
  const mainWorker = bundle.mainWorker
  if (mainWorker) {
    const worker = await duckdb.createWorker(mainWorker)
    return { bundle, worker }
  } else {
    throw Error(`No mainWorker: ${mainWorker}`)
  }
}

export async function getDuckConn(): Promise<DuckConn> {
  if (duckConn) {
    return duckConn;
  } else if (initialize) {
    // The initialization has already been started, wait for it to finish
    return initialize;
  }

  let resolve: (value: DuckConn) => void;
  let reject: (reason?: any) => void;
  initialize = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  try {
    console.time("duckdb-wasm fetch")
    const { worker, bundle } = await (typeof window === 'undefined' ? nodeWorkerBundle() : browserWorkerBundle())
    console.timeEnd("duckdb-wasm fetch")
    console.log("bestBundle:", bundle)
    console.time("DB instantiation");
    const logger = ENABLE_DUCK_LOGGING
      ? new duckdb.ConsoleLogger()
      : SilentLogger;
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    await db.open({
      path: ":memory:",
      query: {
        castBigIntToDouble: true,
      },
    });
    const conn = await db.connect();
    // Replace conn.query to include full query in the error message
    const connQuery = conn.query;
    conn.query = async (q: string): Promise<Table<any>> => {
      const stack = new Error().stack;
      return await connQuery.call(conn, q);
    };
    duckConn = { db, conn, worker };
    resolve!(duckConn);
    console.timeEnd("DB instantiation");
  } catch (err) {
    reject!(err);
    throw err;
  }

  return duckConn;
}

export async function loadParquet<T>(path: string): Promise<T[]> {
  const query = `select * from read_parquet('${path}')`
  const conn = (await getDuckConn()).conn
  const result = await conn.query(query)
  const proxies = result.toArray()
  return JSON.parse(JSON.stringify(proxies)) as T[]
}

export function useParquet<T>(url: string): T[] | null {
  const [ data, setData ] = useState<T[] | null>(null)
  useEffect(
      () => {
        loadParquet<T>(url).then(data => setData(data))
      },
      []
  )
  return data
}

export async function parquetBuf2json<T>(bytes: number[] | Uint8Array, table: string, cb: (rows: T[]) => void): Promise<AsyncDuckDB> {
  const query = `SELECT * FROM parquet_scan('${table}')`
  const db = (await getDuckConn()).db
  const uarr = new Uint8Array(bytes)
  await db.registerFileBuffer(table, uarr)
  const conn = await db.connect()
  const result = await conn.query(query)
  const data = JSON.parse(JSON.stringify(result.toArray())) as T[]
  cb(data)
  return db
}

export function useParquetBuf<T>(bytes: number[] | Uint8Array, table: string): T[] | null {
  const [ data, setData ] = useState<T[] | null>(null)
  useEffect(
      () => {
        parquetBuf2json(bytes, table, setData)
      },
      []
  )
  return data
}
