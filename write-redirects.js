#!/usr/bin/env node

// Load "redirects.json", write simple HTML files into the "out" directory, containing a meta redirect tag.
// Can be used after a `next export` to create a static site with redirects.
import fs from "fs"
import { dirname } from "path"
import program from 'commander';

const { entries } = Object

const options =
    program
        .option('-b, --base-path <path>', 'Base path to prepend to all redirects')
        .option('-o, --out-dir <path>', 'Directory to write redirects to; default: out')
        .option('-f, --file <path>', 'File to read redirects from; default: redirects.json')
        .option('-s, --trailing-slash', 'Write redirects to <out>/<dst>/index.html instead of <out>/<dst>.html; use when next.config.js has `trailingSlash: true`')
        .parse(process.argv)
        .opts()

let { basePath = "/", outDir = "out", file = "redirects.json", trailingSlash, } = options
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
    let dir, outPath
    if (trailingSlash) {
        dir = `${outDir}${basePath}${src}`
        outPath = `${dir}/index.html`
    } else {
        outPath = `${outDir}${basePath}${src}`
        if (!outPath.endsWith(".html")) {
            outPath += ".html"
        }
        dir = dirname(outPath)
    }
    const content = `<meta http-equiv=Refresh content="0; url=${basePath}${dst}" />`
    if (!fs.existsSync(dir)) {
        console.log(`mkdir: ${dir}`)
        fs.mkdirSync(dir, {recursive: true})
    }
    console.log(`Writing ${outPath}: ${content}`)
    fs.writeFileSync(outPath, content)
})
