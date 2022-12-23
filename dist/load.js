import fs from "fs";
import path from "path";
import fetch from "node-fetch";
export async function getSync(url) {
    return await (await fetch(url)).json();
}
export function get(url) {
    return fetch(url).then(data => data.json());
}
export function loadSync(relPath) {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), relPath), 'utf-8'));
}
