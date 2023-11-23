
export default function singleton<T>(ts: T[]): T | null {
    const set = new Set(ts)
    return (set.size !== 1) ? null : set.values().next().value
}
