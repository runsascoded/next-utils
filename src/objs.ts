export const { entries, values, keys, fromEntries } = Object

export const Arr = Array.from

export function o2a<K extends string | number, V, W>(o: { [k in K]: V }, fn: (k: K, v: V, idx: number) => W): W[] {
    return entries<V>(o).map(([ k, v ], idx) => fn(k as K, v, idx))
}

export function isSorted<T>(vs: T[]): boolean {
    let prv: T | null = null
    for (let cur of vs) {
        if (prv !== null && cur < prv) return false
        prv = cur
    }
    return true
}

export const concat = <T>(arrays: T[][]): T[] => ([] as T[]).concat(...arrays)

export function order<T>(u: { [k: string]: T }) {
    return keys(u).sort().reduce(
        (o: { [k: string]: T }, k: string) => {
            o[k] = u[k];
            return o;
        },
        {}
    );
}

export function reorder<K extends string, T>(u: { [k in K]: T }, keys: K[]) {
    return keys.reduce(
        (o, k) => {
            o[k] = u[k];
            return o;
        },
        {} as { [k in K]: T }
    );
}

export function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0)
}

export function sumValues(o: { [k: string]: number }) {
    return sum(values(o))
}

export function mapEntries<T, V>(o: { [k: string]: T }, fn: (k: string, t: T, idx: number) => [ string, V ], reverse?: boolean) {
    const ents = entries(o).map(([ k, t ], idx) => fn(k, t, idx))
    if (reverse) {
        ents.reverse()
    }
    return fromEntries(ents)
}

export function mapValues<T, V>(o: { [k: string]: T }, fn: (k: string, t: T) => V) {
    return mapEntries<T, V>(o, ( k, t) => [ k, fn(k, t) ])
}

export function filterKeys<T>(o: { [k: string]: T }, fn: (k: string) => boolean) {
    return fromEntries(entries(o).filter(([ k, t ]) => fn(k)))
}

export function filterEntries<T>(o: { [k: string]: T }, fn: (k: string, t: T) => boolean) {
    return fromEntries(entries(o).filter(([ k, t ]) => fn(k, t)))
}
