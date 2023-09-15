#!/usr/bin/env node

// Load "redirects.json", write simple HTML files into the "out" directory, containing a meta redirect tag.
// Can be used after a `next export` to create a static site with redirects.
import fs from "fs"
const { entries } = Object

import program from 'commander';

const cwd = process.cwd()

const options =
    program
        .option('-b, --base-path <path>', 'Base path to prepend to all redirects')
        .option('-o, --out-dir <path>', 'Directory to write redirects to; default: out')
        .option('-f, --file <path>', 'File to read redirects from; default: redirects.json')
        .parse(process.argv)
        .opts()

let { basePath = "/", outDir = "out", file = "redirects.json" } = options
const redirects = JSON.parse(fs.readFileSync(file).toString())
console.log(redirects)

if (!basePath.startsWith("/")) {
    basePath = `/${basePath}`
}
entries(redirects).map(([ src, dst ]) => {
    if (!src.startsWith("/")) {
        src = `/${src}`
    }
    if (!dst.startsWith("/")) {
        dst = `/${dst}`
    }
    const dir = `${outDir}${basePath}${src}`
    const outPath = `${dir}/index.html`
    const content = `<meta http-equiv=Refresh content="0; url=${basePath}${dst}" />`
    if (!fs.existsSync(dir)) {
        console.log(`mkdir: ${dir}`)
        fs.mkdirSync(dir, {recursive: true})
    }
    console.log(`Writing ${outPath}: ${content}`)
    fs.writeFileSync(outPath, content)
})
