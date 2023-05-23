import { Dispatch } from "react";
export type Actions<T> = {
    add: Dispatch<T>;
    remove: Dispatch<T>;
    set: Dispatch<T[]>;
    reset: () => void;
};
export declare const useSet: <T>(initialValue?: T[]) => [T[], Actions<T>];
export type OptActions<T> = {
    add: Dispatch<T>;
    remove: Dispatch<T>;
    set: Dispatch<T[] | null>;
    reset: () => void;
};
export declare const useOptSet: <T>(initialValue?: T[] | null) => [T[] | null, OptActions<T>];
