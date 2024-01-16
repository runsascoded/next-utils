/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import Worker from 'web-worker';
import path from "path";
import { useEffect, useState } from "react";
const ENABLE_DUCK_LOGGING = false;
const SilentLogger = { log: () => { }, };
export async function nodeWorkerBundle() {
    const DUCKDB_DIST = `node_modules/@duckdb/duckdb-wasm/dist`;
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
    const mainWorker = bundle.mainWorker;
    if (mainWorker) {
        console.log("Instantiating worker:", mainWorker);
        const worker = new Worker(mainWorker);
        console.log("Instantiated worker");
        return { bundle, worker };
    }
    else {
        throw Error(`No mainWorker: ${mainWorker}`);
    }
}
export async function browserWorkerBundle() {
    const allBundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(allBundles);
    const mainWorker = bundle.mainWorker;
    if (mainWorker) {
        const worker = await duckdb.createWorker(mainWorker);
        return { bundle, worker };
    }
    else {
        throw Error(`No mainWorker: ${mainWorker}`);
    }
}
// Global AsyncDuckDB instance
let dbPromise = null;
/**
 * Fetch global AsyncDuckDB instance; initialize if necessary
 */
export function getDuckDb() {
    if (!dbPromise) {
        dbPromise = initDuckDb();
    }
    return dbPromise;
}
/**
 * Initialize global AsyncDuckDB instance
 */
export async function initDuckDb(opts) {
    const path = opts?.path ?? ":memory:";
    const fetchTimerKey = `duckdb-wasm fetch ${path}`;
    console.time(fetchTimerKey);
    const { worker, bundle } = await (typeof window === 'undefined' ? nodeWorkerBundle() : browserWorkerBundle());
    console.timeEnd(fetchTimerKey);
    console.log("bestBundle:", bundle);
    const dbTimerKey = `duckdb-wasm instantiate ${path}`;
    console.time(dbTimerKey);
    const logger = ENABLE_DUCK_LOGGING
        ? new duckdb.ConsoleLogger()
        : SilentLogger;
    const db = new AsyncDuckDB(logger, worker);
    console.log("instantiate db");
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    console.log("instantiated db");
    await db.open({
        path,
        query: {
            castBigIntToDouble: true,
        },
    });
    console.timeEnd(dbTimerKey);
    return db;
}
/**
 * Run a query against the provided DuckDB instance, round-trip through JSON to obtain plain JS objects
 */
export async function runQuery(db, query) {
    const conn = await db.connect();
    const result = await conn.query(query);
    const proxies = result.toArray();
    // TODO: is there an easier / cheaper way to get plain JS objects here?
    return JSON.parse(JSON.stringify(proxies));
}
/**
 * Load a parquet file from a local path or URL
 */
export async function loadParquet(path) {
    const db = await getDuckDb();
    return runQuery(db, `select * from read_parquet('${path}')`);
}
/**
 * Hook for loading a parquet file or URL; starts out `null`, gets populated asynchronously
 */
export function useParquet(url) {
    const [data, setData] = useState(null);
    useEffect(() => {
        if (!url)
            return;
        loadParquet(url).then(data => setData(data));
    }, []);
    return data;
}
/**
 * Convert [a byte array representing a Parquet file] to an array of records
 */
export async function parquetBuf2json(bytes, table) {
    const db = await getDuckDb();
    const uarr = new Uint8Array(bytes);
    await db.registerFileBuffer(table, uarr);
    return runQuery(db, `SELECT * FROM parquet_scan('${table}')`);
}
/**
 * Hook for converting a Parquet byte array to records
 */
export function useParquetBuf(bytes, table) {
    const [data, setData] = useState(null);
    useEffect(() => {
        parquetBuf2json(bytes, table).then(data => setData(data));
    }, []);
    return data;
}
