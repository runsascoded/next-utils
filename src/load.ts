import fs from "fs";
import path from "path";
import fetch from "node-fetch"

export async function getSync<T>(url: string) {
    return await (await fetch(url)).json() as T
}

export function get<T>(url: string) {
    return fetch(url).then(data => data.json() as T)
}

export function loadSync<T>(relPath: string) {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), relPath), 'utf-8')) as T
}
