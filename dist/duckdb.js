/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import Worker from 'web-worker';
import path from "path";
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
/**
 * Initialize global AsyncDuckDB instance
 */
export async function initDuckDb(opts) {
    const path = opts?.path ?? ":memory:";
    const fetchTimerKey = `duckdb-wasm fetch ${path}`;
    console.time(fetchTimerKey);
    const { worker, bundle } = await nodeWorkerBundle();
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
