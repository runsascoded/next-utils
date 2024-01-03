import { AsyncDuckDB, DuckDBBundle } from "@duckdb/duckdb-wasm";
type WorkerBundle = {
    bundle: DuckDBBundle;
    worker: Worker;
};
export declare function nodeWorkerBundle(): Promise<WorkerBundle>;
export declare function browserWorkerBundle(): Promise<WorkerBundle>;
/**
 * Fetch global AsyncDuckDB instance; initialize if necessary
 */
export declare function getDuckDb(): Promise<AsyncDuckDB>;
/**
 * Initialize global AsyncDuckDB instance
 */
export declare function initDuckDb(opts?: {
    path?: string;
}): Promise<AsyncDuckDB>;
/**
 * Run a query against the provided DuckDB instance, round-trip through JSON to obtain plain JS objects
 */
export declare function runQuery<T>(db: AsyncDuckDB, query: string): Promise<T[]>;
/**
 * Load a parquet file from a local path or URL
 */
export declare function loadParquet<T>(path: string): Promise<T[]>;
/**
 * Hook for loading a parquet file or URL; starts out `null`, gets populated asynchronously
 */
export declare function useParquet<T>(url?: string): T[] | null;
/**
 * Convert [a byte array representing a Parquet file] to an array of records
 */
export declare function parquetBuf2json<T>(bytes: number[] | Uint8Array, table: string): Promise<T[]>;
/**
 * Hook for converting a Parquet byte array to records
 */
export declare function useParquetBuf<T>(bytes: number[] | Uint8Array, table: string): T[] | null;
export {};
