import {Dispatch, useMemo, useState} from "react";

export type Actions<T> = {
    add: Dispatch<T>
    remove: Dispatch<T>
    set: Dispatch<T[]>
    reset: () => void
}

export const useSet = <T>(initialValue: T[] = []): [ T[], Actions<T> ] => {
    const [elems, setElems] = useState(initialValue);
    const actions = useMemo(
        () => ({
            add: (elem: T) => {
                if (!elems.includes(elem)) {
                    setElems([...elems, elem])
                }
            },
            remove: (elem: T) => {
                if (elems.includes(elem)) {
                    setElems(elems.filter(e => e != elem))
                }
            },
            set: (elems: T[]) => {
                setElems(elems)
            },
            reset: () => setElems(initialValue),
        }),
        [ elems, setElems, ]
    );
    return [ elems, actions ];
}

export type OptActions<T> = {
    add: Dispatch<T>
    remove: Dispatch<T>
    set: Dispatch<T[] | null>
    reset: () => void
}

export const useOptSet = <T>(initialValue: T[] | null = null): [ T[] | null, OptActions<T> ] => {
    const [elems, setElems] = useState(initialValue);
    const actions = useMemo(
        () => ({
            add: (elem: T) => {
                if (!elems) {
                    setElems([elem])
                } else if (!elems.includes(elem)) {
                    setElems([...elems, elem])
                }
            },
            remove: (elem: T) => {
                if (elems?.includes(elem)) {
                    setElems(elems.filter(e => e != elem))
                }
            },
            set: (elems: T[] | null) => {
                setElems(elems)
            },
            reset: () => setElems(initialValue),
        }),
        [ elems, setElems, ]
    );
    return [ elems, actions ];
}
