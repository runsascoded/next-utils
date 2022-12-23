import { Dispatch } from "react";
export declare const pathnameRegex: RegExp;
export type Param<T> = {
    encode: (t: T) => string | undefined;
    decode: (v: string | undefined) => T;
    push?: boolean;
};
export type ParsedParam<T> = [T, Dispatch<T>];
export declare function stringParam(push?: boolean): Param<string | undefined>;
export declare function defStringParam(init: string, push?: boolean): Param<string>;
export declare function floatParam(init: number, push?: boolean): Param<number>;
export declare function enumMultiParam<T extends string>(init: T[], mapper: {
    [k in T]: string;
} | [T, string][], delim?: string): Param<T[]>;
export declare function enumParam<T extends string>(init: T, mapper: {
    [k in T]: string;
} | [T, string][]): Param<T>;
export declare const boolParam: Param<boolean>;
export declare function numberArrayParam(defaultValue?: number[]): Param<number[]>;
export type LL = {
    lat: number;
    lng: number;
};
export declare function llParam({ init, places, push }: {
    init: LL;
    places?: number;
    push?: boolean;
}): Param<LL>;
export declare function parseQueryParams<Params extends {
    [k: string]: Param<any>;
}, ParsedParams>({ params }: {
    params: Params;
}): ParsedParams;
