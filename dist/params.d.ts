import { Dispatch } from "react";
import { Actions, OptActions } from "./use-set";
export declare const pathnameRegex: RegExp;
export declare const pathQueryRegex: RegExp;
export type Param<T, U = Dispatch<T>> = {
    encode: (t: T) => string | undefined;
    decode: (v: string | undefined) => T;
    push?: boolean;
    use?: (init: T) => [T, U];
};
export type ParsedParam<T> = [T, Dispatch<T>];
export declare function stringParam(push?: boolean): Param<string | undefined>;
export declare function defStringParam(init: string, push?: boolean): Param<string>;
/**
 * Param for storing URLs specifically; strips off the leading "https://"
 * @param init initial/default value, query param is omitted iff the value matches this
 * @param push whether to push changes into the browser's history/navigation stack
 */
export declare function urlParam(init: string, push?: boolean): Param<string>;
export declare function intParam(init: number, push?: boolean): Param<number>;
export declare function optIntParam(push?: boolean): Param<number | null>;
export declare function floatParam(init: number, push?: boolean): Param<number>;
export declare function stringsParam(props?: {
    init?: string[];
    delimiter?: string;
}): Param<string[], Actions<string>>;
export declare function optStringsParam(props?: {
    emptyIsUndefined?: boolean;
    delimiter?: string;
}): Param<null | string[], OptActions<string>>;
export declare function enumMultiParam<T extends string>(init: T[], mapper: {
    [k in T]: string;
} | [T, string][], delim?: string): Param<T[]>;
export declare function enumParam<T extends string>(init: T, mapper: {
    [k in T]: string;
} | [T, string][]): Param<T>;
export declare const boolParam: Param<boolean>;
export declare function numberArrayParam(defaultValue?: number[]): Param<number[]>;
export declare function parseLLs(str: string): number[];
export type LL = {
    lat: number;
    lng: number;
};
export type LLParam = {
    init: LL;
    places?: number;
    push?: boolean;
};
export declare function llParam({ init, places, push }: LLParam): Param<LL>;
export type BB = {
    sw: LL;
    ne: LL;
};
export type BBParam = {
    init: BB;
    places?: number;
    push?: boolean;
};
export declare function bbParam({ init, places, push }: BBParam): Param<BB>;
export declare function parseQueryParams<Params extends {
    [k: string]: Param<any, any>;
}, ParsedParams>({ params }: {
    params: Params;
}): ParsedParams;
export declare const getHash: () => string | undefined;
export declare function getHashMap<Params extends {
    [k: string]: Param<any, any>;
}>(params: Params, hash?: string): {
    [k: string]: any;
};
export declare function updatedHash<Params extends {
    [k: string]: Param<any, any>;
}>(params: Params, newVals: {
    [k: string]: any;
}): string;
export declare function updateHashParams<Params extends {
    [k: string]: Param<any, any>;
}>(params: Params, newVals: {
    [k: string]: any;
}, pushState?: boolean): void;
export declare function parseHashParams<Params extends {
    [k: string]: Param<any, any>;
}, ParsedParams>({ params }: {
    params: Params;
}): ParsedParams;
