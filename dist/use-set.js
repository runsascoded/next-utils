import { useMemo, useState } from "react";
export const useSet = (initialValue = []) => {
    const [elems, setElems] = useState(initialValue);
    const actions = useMemo(() => ({
        add: (elem) => {
            if (!elems.includes(elem)) {
                setElems([...elems, elem]);
            }
        },
        remove: (elem) => {
            if (elems.includes(elem)) {
                setElems(elems.filter(e => e != elem));
            }
        },
        set: (elems) => {
            setElems(elems);
        },
        reset: () => setElems(initialValue),
    }), [elems, setElems,]);
    return [elems, actions];
};
export const useOptSet = (initialValue = null) => {
    const [elems, setElems] = useState(initialValue);
    const actions = useMemo(() => ({
        add: (elem) => {
            if (!elems) {
                setElems([elem]);
            }
            else if (!elems.includes(elem)) {
                setElems([...elems, elem]);
            }
        },
        remove: (elem) => {
            if (elems?.includes(elem)) {
                setElems(elems.filter(e => e != elem));
            }
        },
        set: (elems) => {
            setElems(elems);
        },
        reset: () => setElems(initialValue),
    }), [elems, setElems,]);
    return [elems, actions];
};
