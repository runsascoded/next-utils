import { AsyncDuckDB, DuckDBBundle } from "@duckdb/duckdb-wasm";
type WorkerBundle = {
    bundle: DuckDBBundle;
    worker: Worker;
};
export declare function nodeWorkerBundle(): Promise<WorkerBundle>;
/**
 * Initialize global AsyncDuckDB instance
 */
export declare function initDuckDb(opts?: {
    path?: string;
}): Promise<AsyncDuckDB>;
export {};
