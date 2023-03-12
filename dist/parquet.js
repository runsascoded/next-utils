/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import Worker from 'web-worker';
import path from "path";
import { useEffect, useState } from "react";
const ENABLE_DUCK_LOGGING = false;
const SilentLogger = {
    log: () => {
        /* do nothing */
    },
};
// TODO: shut DB down at some point
let duckConn;
let initialize;
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
        const worker = new Worker(mainWorker);
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
export async function getDuckConn() {
    if (duckConn) {
        return duckConn;
    }
    else if (initialize) {
        // The initialization has already been started, wait for it to finish
        return initialize;
    }
    let resolve;
    let reject;
    initialize = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    try {
        console.time("duckdb-wasm fetch");
        const { worker, bundle } = await (typeof window === 'undefined' ? nodeWorkerBundle() : browserWorkerBundle());
        console.timeEnd("duckdb-wasm fetch");
        console.log("bestBundle:", bundle);
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
        conn.query = async (q) => {
            const stack = new Error().stack;
            return await connQuery.call(conn, q);
        };
        duckConn = { db, conn, worker };
        resolve(duckConn);
        console.timeEnd("DB instantiation");
    }
    catch (err) {
        reject(err);
        throw err;
    }
    return duckConn;
}
export async function loadParquet(path) {
    const query = `select * from read_parquet('${path}')`;
    const conn = (await getDuckConn()).conn;
    const result = await conn.query(query);
    const proxies = result.toArray();
    return JSON.parse(JSON.stringify(proxies));
}
export function useParquet(url) {
    const [data, setData] = useState(null);
    useEffect(() => {
        loadParquet(url).then(data => setData(data));
    }, []);
    return data;
}
export async function parquetBuf2json(bytes, table, cb) {
    const query = `SELECT * FROM parquet_scan('${table}')`;
    const db = (await getDuckConn()).db;
    const uarr = new Uint8Array(bytes);
    await db.registerFileBuffer(table, uarr);
    const conn = await db.connect();
    const result = await conn.query(query);
    const data = JSON.parse(JSON.stringify(result.toArray()));
    cb(data);
    return db;
}
export function useParquetBuf(bytes, table) {
    const [data, setData] = useState(null);
    useEffect(() => {
        parquetBuf2json(bytes, table, setData);
    }, []);
    return data;
}