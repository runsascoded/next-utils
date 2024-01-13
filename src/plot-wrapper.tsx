import * as css from "./plot.css";
import Image from "next/image";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { PlotParams } from "react-plotly.js";
import dynamic from "next/dynamic";
import { getBasePath } from "./basePath";

const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false })

export type Props = {
    params: PlotParams
    src: string
    alt: string
    width?: number
    height?: number
    setXRange?: Dispatch<[number, number] | null>
    basePath?: string
}

export const DEFAULT_MARGIN = { t: 0, r: 15, b: 0, l: 0 }
export const DEFAULT_WIDTH = 800
export const DEFAULT_HEIGHT = 450

export default function PlotWrapper({ params, src, alt, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, setXRange, basePath, }: Props) {
    const [ initialized, setInitialized ] = useState(false)
    const [ computedHeight, setComputedHeight ] = useState<number | null>(null)
    const [ showLegend, setShowLegend ] = useState(true)
    const legendRef = useRef<HTMLElement | null>(null)
    // console.log("render: showLegend", showLegend)
    useEffect(() => {
        // if (!showLegend) return
        const legend = legendRef.current
        if (!legend) {
            console.log("No legend")
            return
        }
        if (showLegend) {
            legend.style.opacity = "1"
            legend.style.display = ""
            // legend.classList.remove("hidden")
        } else {
            legend.style.opacity = "0"
            legend.style.display = "none"
            // legend.classList.add("hidden")
        }
    }, [ showLegend, initialized, ])
    const {
        data,
        layout,
        style
    } = params
    height = computedHeight !== null ? computedHeight : (typeof style?.height === 'number' ? style?.height : height)
    basePath = basePath || getBasePath() || ""
    src = `${basePath}/${src}`
    return (
        // <div className={css.plot}>
            <div className={css.plotWrapper}>
                <div className={`${css.fallback} ${initialized ? css.hidden : ""}`}
                     style={{height: `${height}px`, maxHeight: `${height}px`}}>{
                    src && <>
                        <Image
                            alt={alt}
                            src={src}
                            width={width} height={height}
                            // layout="responsive"
                            loading="lazy"
                            // onClick={() => setInitialized(true)}
                        />
                        <div className={css.spinner}></div>
                    </>
                }</div>
                {/*<div className={css.legendToggle} onClick={() => setShowLegend(!showLegend)}>*/}
                {/*    {showLegend ? "" : "?"}*/}
                {/*</div>*/}
                <Plotly
                    onInitialized={(fig, div) => {
                        const parent = div.offsetParent as HTMLElement
                        const [legend] = div.getElementsByClassName('legend') as any as HTMLElement[]
                        legendRef.current = legend
                        setInitialized(true)
                        setComputedHeight(parent.offsetHeight)
                    }}
                    onDoubleClick={() => {
                        if (setXRange) {
                            setXRange(null)
                        }
                    }}
                    onLegendClick={e => {
                        const { curveNumber, data } = e
                        const { name } = data[curveNumber]
                        console.log(`legend click: ${name}`, e)
                        return true
                    }}
                    onLegendDoubleClick={e => {
                        const { curveNumber, data } = e
                        const { name } = data[curveNumber]
                        console.log(`legend double click ${name}:`, e)
                        return true
                    }}
                    onRelayout={e => {
                        console.log("relayout:", e)
                        if (!('xaxis.range[0]' in e && 'xaxis.range[1]' in e)) return
                        console.log(e)
                        let [start, end] = [e['xaxis.range[0]'] as number, e['xaxis.range[1]'] as number,]//.map(s => s ? new Date(s) : undefined)
                        console.log("start, end", start, end)
                        start = Math.round(start - 0.5) + 0.5
                        end = Math.round(end + 0.5) - 0.5
                        console.log("after rounding", start, end)
                        if (setXRange) {
                            setXRange([ start, end ])
                        }
                    }}
                    className={css.plotly}
                    data={data}
                    config={{displayModeBar: false, scrollZoom: false, responsive: true,}}
                    style={{...style, visibility: initialized ? undefined : "hidden", width: "100%"}}
                    layout={layout}
                    // onClick={() => setInitialized(false)}
                />
            </div>
        // </div>
    )
}
