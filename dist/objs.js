export const { entries, values, keys, fromEntries } = Object;
export function o2a(o, fn) {
    return entries(o).map(([k, v]) => fn(k, v));
}
export function order(u) {
    return keys(u).sort().reduce((o, k) => {
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
export function mapEntries(o, fn) {
    return fromEntries(entries(o).map(([k, t]) => fn(k, t)));
}
export function mapValues(o, fn) {
    return mapEntries(o, (k, t) => [k, fn(k, t)]);
}
export function filterEntries(o, fn) {
    return fromEntries(entries(o).filter(([k, t]) => fn(k, t)));
}
