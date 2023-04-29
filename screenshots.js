#!/usr/bin/env node

const puppeteer = require('puppeteer');
const program = require('commander');

const cwd = process.cwd()

async function screenshots({ defaultDir,  defaultHost, defaultSelector, downloadSleepS, screens }) {
    const options =
        program
            .option('-h, --host <host or port>', 'Hostname to load screenshots from; numeric <port> is mapped to 127.0.0.1:<port>')
            .option('-i, --include <regex>', 'Only generate screenshots whose name matches this regex')
            .option('-s, --sleep <seconds>', 'In cases with `download: true`, sleep this long while waiting for a file to download')
            .parse(process.argv)
            .opts()

    let scheme
    let {host, include, defaultDownloadSleepS } = options
    if (host) {
        scheme = 'http'
        if (host.match(/^\d+$/)) {
            host = `127.0.0.1:${host}`
        }
    } else {
        host = defaultHost
        scheme = 'https'
    }
    console.log("host:", host, "includes:", include);

    const dir = `${cwd}/${defaultDir}`

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const items = Array.from(Object.entries(screens))
    for (let [ name, { query, width, height, selector, download } ] of items) {
        if (include && !name.match(include)) {
            console.log(`Skipping ${name}`)
            continue
        }
        width = width || 800
        height = height || 580
        selector = selector || defaultSelector
        const url = `${scheme}://${host}/${query}`
        const path = `${dir}/${name}.png`
        if (download) {
            console.log(`Setting download behavior to ${dir}`)
            await page._client().send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: dir
            });
        }
        console.log(`Loading ${url}`)
        await page.goto(url);
        console.log(`Loaded ${url}`)

        await page.setViewport({ width, height });
        console.log("setViewport")
        await page.waitForSelector(selector);
        console.log("selector")
        if (!download) {
            await page.screenshot({path});
        } else {
            const sleepS = defaultDownloadSleepS || downloadSleepS || 5
            console.log(`sleep ${sleepS}s`)
            await new Promise(r => setTimeout(r, sleepS * 1000 ))
            console.log("sleep done")
        }
    }

    await browser.close();
}
