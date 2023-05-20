import { Dispatch } from "react";
export type Actions<T> = {
    add: Dispatch<T>;
    remove: Dispatch<T>;
    set: Dispatch<T[]>;
    clear: () => void;
};
export declare const useSet: <T>(initialValue?: T[]) => [T[], Actions<T>];
