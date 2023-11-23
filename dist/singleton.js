export default function singleton(ts) {
    const set = new Set(ts);
    return (set.size !== 1) ? null : set.values().next().value;
}
