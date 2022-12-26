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
export declare function o2a<K extends string, V, W>(o: {
    [k in K]: V;
}, fn: (k: K, v: V) => W): W[];
export declare function order<T>(u: {
    [k: string]: T;
}): {
    [k: string]: T;
};
export declare function sum(arr: number[]): number;
export declare function sumValues(o: {
    [k: string]: number;
}): number;
export declare function mapEntries<T, V>(o: {
    [k: string]: T;
}, fn: (k: string, t: T) => [string, V]): {
    [k: string]: V;
};
export declare function mapValues<T, V>(o: {
    [k: string]: T;
}, fn: (k: string, t: T) => V): {
    [k: string]: V;
};
export declare function filterEntries<T>(o: {
    [k: string]: T;
}, fn: (k: string, t: T) => boolean): {
    [k: string]: T;
};
