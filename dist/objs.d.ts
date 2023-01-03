export declare const entries: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): [string, T][];
    (o: {}): [string, any][];
}, values: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): T[];
    (o: {}): any[];
}, keys: {
    (o: object): string[];
    (o: {}): string[];
}, fromEntries: {
    <T = any>(entries: Iterable<readonly [PropertyKey, T]>): {
        [k: string]: T;
    };
    (entries: Iterable<readonly any[]>): any;
};
export declare const Arr: {
    <T>(arrayLike: ArrayLike<T>): T[];
    <T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
    <T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
    <T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
};
export declare function o2a<K extends string | number, V, W>(o: {
    [k in K]: V;
}, fn: (k: K, v: V, idx: number) => W): W[];
export declare function isSorted<T>(vs: T[]): boolean;
export declare const concat: <T>(arrays: T[][]) => T[];
export declare function order<T>(u: {
    [k: string]: T;
}): {
    [k: string]: T;
};
export declare function reorder<K extends string, T>(u: {
    [k in K]: T;
}, keys: K[]): { [k in K]: T; };
export declare function sum(arr: number[]): number;
export declare function sumValues(o: {
    [k: string]: number;
}): number;
export declare function mapEntries<T, V>(o: {
    [k: string]: T;
}, fn: (k: string, t: T, idx: number) => [string, V], reverse?: boolean): {
    [k: string]: V;
};
export declare function mapValues<T, V>(o: {
    [k: string]: T;
}, fn: (k: string, t: T) => V): {
    [k: string]: V;
};
export declare function filterKeys<T>(o: {
    [k: string]: T;
}, fn: (k: string) => boolean): {
    [k: string]: T;
};
export declare function filterEntries<T>(o: {
    [k: string]: T;
}, fn: (k: string, t: T) => boolean): {
    [k: string]: T;
};
