/**
 * Adapted from https://github.com/ilyabo/graphnavi / https://github.com/duckdb/duckdb-wasm/issues/1148
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import { AsyncDuckDB, DuckDBBundle } from "@duckdb/duckdb-wasm";
export type DuckConn = {
    db: duckdb.AsyncDuckDB;
    conn: duckdb.AsyncDuckDBConnection;
    worker: Worker;
};
type WorkerBundle = {
    bundle: DuckDBBundle;
    worker: Worker;
};
export declare function nodeWorkerBundle(): Promise<WorkerBundle>;
export declare function browserWorkerBundle(): Promise<WorkerBundle>;
export declare function getDuckConn(): Promise<DuckConn>;
export declare function loadParquet<T>(path: string): Promise<T[]>;
export declare function useParquet<T>(url: string): T[] | null;
export declare function parquetBuf2json<T>(bytes: number[] | Uint8Array, table: string, cb: (rows: T[]) => void): Promise<AsyncDuckDB>;
export declare function useParquetBuf<T>(bytes: number[] | Uint8Array, table: string): T[] | null;
export {};
