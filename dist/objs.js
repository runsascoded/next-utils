export const { entries, values, keys, fromEntries } = Object;
export const Arr = Array.from;
export function o2a(o, fn) {
    return entries(o).map(([k, v], idx) => fn(k, v, idx));
}
export function isSorted(vs) {
    let prv = null;
    for (let cur of vs) {
        if (prv !== null && cur < prv)
            return false;
        prv = cur;
    }
    return true;
}
export const concat = (arrays) => [].concat(...arrays);
export function order(u) {
    return keys(u).sort().reduce((o, k) => {
        o[k] = u[k];
        return o;
    }, {});
}
export function reorder(u, keys) {
    return keys.reduce((o, k) => {
        o[k] = u[k];
        return o;
    }, {});
}
export function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}
export function sumValues(o) {
    return sum(values(o));
}
export function mapEntries(o, fn, reverse) {
    const ents = entries(o).map(([k, t], idx) => fn(k, t, idx));
    if (reverse) {
        ents.reverse();
    }
    return fromEntries(ents);
}
export function mapValues(o, fn) {
    return mapEntries(o, (k, t) => [k, fn(k, t)]);
}
export function filterKeys(o, fn) {
    return fromEntries(entries(o).filter(([k, t]) => fn(k)));
}
export function filterEntries(o, fn) {
    return fromEntries(entries(o).filter(([k, t]) => fn(k, t)));
}
