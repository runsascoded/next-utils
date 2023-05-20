import {Dispatch, useMemo, useState} from "react";

export type Actions<T> = {
    add: Dispatch<T>
    remove: Dispatch<T>
    set: Dispatch<T[]>
    clear: () => void
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
            clear: () => setElems([]),
        }),
        [ elems, setElems, ]
    );
    return [ elems, actions ];
}
