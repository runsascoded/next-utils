export const { entries, values, keys, fromEntries } = Object

export function o2a<K extends string, V, W>(o: { [k in K]: V }, fn: (k: K, v: V) => W): W[] {
    return entries<V>(o).map(([ k, v ]) => fn(k as K, v))
}

export function order<T>(u: { [k: string]: T }) {
    return keys(u).sort().reduce(
        (o: { [k: string]: T }, k: string) => {
            o[k] = u[k];
            return o;
        },
        {}
    );
}

export function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0)
}

export function sumValues(o: { [k: string]: number }) {
    return sum(values(o))
}

export function mapEntries<T, V>(o: { [k: string]: T }, fn: (k: string, t: T) => [ string, V ]) {
    return fromEntries(entries(o).map(([ k, t ]) => fn(k, t)))
}

export function mapValues<T, V>(o: { [k: string]: T }, fn: (k: string, t: T) => V) {
    return mapEntries<T, V>(o, ( k, t) => [ k, fn(k, t) ])
}

export function filterEntries<T>(o: { [k: string]: T }, fn: (k: string, t: T) => boolean) {
    return fromEntries(entries(o).filter(([ k, t ]) => fn(k, t)))
}
