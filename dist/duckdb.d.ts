/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import { AsyncDuckDB, DuckDBBundle } from "@duckdb/duckdb-wasm";
type WorkerBundle = {
    bundle: DuckDBBundle;
    worker: Worker;
};
export declare function nodeWorkerBundle(): Promise<WorkerBundle>;
/**
 * Initialize global AsyncDuckDB instance
 */
export declare function initDuckDb(): Promise<AsyncDuckDB>;
export {};
