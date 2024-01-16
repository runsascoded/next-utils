/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import { AsyncDuckDB, selectBundle } from "@duckdb/duckdb-wasm";
import Worker from "web-worker";
import path from "path";
export async function nodeWorkerBundle() {
    const DUCKDB_DIST = `node_modules/@duckdb/duckdb-wasm/dist`;
    const bundle = await selectBundle({
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
/**
 * Initialize global AsyncDuckDB instance
 */
export async function initDuckDb() {
    const { worker, bundle } = await nodeWorkerBundle();
    console.log("bundle:", bundle);
    const logger = { log: () => { }, };
    const db = new AsyncDuckDB(logger, worker);
    console.log("instantiating db");
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    console.log("instantiated db");
    await db.open({ path: ":memory:", query: { castBigIntToDouble: true, }, });
    return db;
}
