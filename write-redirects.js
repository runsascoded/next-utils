#!/usr/bin/env node

// Load "redirects.json", write simple HTML files into the "out" directory, containing a meta redirect tag.
// Can be used after a `next export` to create a static site with redirects.
import fs from "fs"
import { dirname } from "path"
import { program } from 'commander';

const { entries } = Object

function inc(val, accum) {
    return accum + 1
}

const options =
    program
        .option('-b, --base-path <path>', 'Base path to prepend to all redirects', "/")
        .option('-o, --out-dir <path>', 'Directory to write redirects to; default: out', "out")
        .option('-f, --file <path>', 'File to read redirects from; default: redirects.json', "redirects.json")
        .option('-s, --trailing-slash', 'Write redirects to <out>/<dst>/index.html instead of <out>/<dst>.html; use when next.config.js has `trailingSlash: true`. Pass twice to write both forms.', inc, 0)
        .parse(process.argv)
        .opts()

console.log("options:", options)
let { basePath, outDir, file, trailingSlash, } = options
const redirects = JSON.parse(fs.readFileSync(file).toString())
console.log(redirects)

if (basePath && !basePath.startsWith("/")) {
    basePath = `/${basePath}`
}
entries(redirects).map(([ src, dst ]) => {
    if (!src.startsWith("/")) {
        src = `/${src}`
    }
    if (!dst.startsWith("/")) {
        dst = `/${dst}`
    }
    let outputs = []
    if (trailingSlash === 1 || trailingSlash === 2) {
        const dir = `${outDir}${src}`
        const outPath = `${dir}/index.html`
        outputs.push({ dir, outPath })
    }
    if (trailingSlash === 0 || trailingSlash === 2) {
        let outPath = `${outDir}${src}`
        if (!outPath.endsWith(".html")) {
            outPath += ".html"
        }
        const dir = dirname(outPath)
        outputs.push({ dir, outPath })
    }
    for (let output of outputs) {
        const { dir, outPath } = output
        const content = `<meta http-equiv=Refresh content="0; url=${basePath}${dst}" />`
        if (!fs.existsSync(dir)) {
            console.log(`mkdir: ${dir}`)
            fs.mkdirSync(dir, {recursive: true})
        }
        console.log(`Writing ${outPath}: ${content}`)
        fs.writeFileSync(outPath, content)
    }
})
