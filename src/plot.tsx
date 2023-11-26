import React, {ReactDOM, ReactNode, useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import * as css from "./plot.css"
import {PlotParams} from "react-plotly.js";
import {Data, Datum, Layout, Legend, Margin, PlotData} from "plotly.js";
import {fromEntries, o2a} from "./objs"
import {getBasePath} from "./basePath";

const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false })

export type NodeArg<T> = Partial<Layout> & T
export type NodeFn<T> = (t: NodeArg<T>) => ReactNode
export type Node<T> = ReactNode | NodeFn<T>

export type PlotsDict = { [id: string]: PlotParams }

export type XRange = [number, number]
export type FilterArgs = {
    data: PlotData[]
    // [ xs, xe ]: [number, number]
    xRange: XRange
}
export type Filter = (_: FilterArgs) => PlotData[]

export const filterIdxs: Filter = ({ data, xRange, }: FilterArgs) => {
    const xs = Math.round(xRange[0])
    const xe = Math.round(xRange[1])
    return data.map(
        ({x, y, ...trace}) => ({
            x: x.slice(xs, xe),
            y: y.slice(xs, xe),
            ...trace,
        })
    )
}

export type FilterValuesArgs = {
    keepNull?: boolean
    mapRange?: (xRange: XRange) => XRange
}
export const filterValues: ({ keepNull, mapRange }: FilterValuesArgs) => Filter =
    ({ keepNull, mapRange }) =>
        ({ data, xRange }) => {
            keepNull = keepNull || keepNull === undefined
            const [ xs, xe ] = mapRange ? mapRange(xRange) : xRange
            // xs = Math.round(xs - 0.5) + 0.5
            // xe = Math.round(xe + 0.5) - 0.5
            return data.map(
                ({x, y, ...trace}) => {
                    x = x as Datum[]
                    y = y as Datum[]
                    const enumerated = x.map((v, idx) => [ v, idx ]).filter(([ v ]) => (v === null ? keepNull : (xs <= v && v <= xe)))
                    const idxs = enumerated.map(([ v, idx ]) => idx)
                    return {
                        x: enumerated.map(([ v ]) => v),
                        y: y.filter((v, idx) => idxs.includes(idx)),
                        ...trace,
                    }
                }
            )
        }

export const HalfRoundWiden: (xRange: XRange) => XRange = ([ xs, xe ]) => {
    xs = Math.round(xs - 0.5) + 0.5
    xe = Math.round(xe + 0.5) - 0.5
    return [ xs, xe ]
}

export type PlotSpec<T = {}> = {
    id: string
    name?: string
    menuName?: string
    dropdownSection?: string,
    title?: string  // taken from plot, by default
    style?: React.CSSProperties
    legend?: "inherit" | Legend
    src?: string
    subtitle?: Node<T>
    filter?: Filter
    children?: Node<T>
}

export type Plot<T = {}> = PlotSpec<T> & {
    plot: PlotParams
    title: string
    margin?: Partial<Margin>
    width?: number
    height?: number
    data?: T
    basePath?: string
}

export const DEFAULT_MARGIN = { t: 0, r: 15, b: 0, l: 0 }
export const DEFAULT_WIDTH = 800
export const DEFAULT_HEIGHT = 450

export function build<T = {}>(specs: PlotSpec<T>[], plots: { [id: string]: PlotParams }, data: T): Plot<T>[] {
    const plotSpecDict: { [id: string]: PlotSpec<T> } = fromEntries(specs.map(spec => [ spec.id, spec ]))
    return o2a(plots, (id, plot) => {
        const spec = plotSpecDict[id]
        let title = spec.title
        if (!title) {
            const plotTitle = plot.layout.title
            if (typeof plotTitle === 'string') {
                title = plotTitle
            } else if (plotTitle?.text) {
                title = plotTitle.text
            } else {
                throw `No title found for plot ${id}`
            }
        }
        return { ...spec, title, plot, data }
    })
}

export function Plot<T = {}>(
    {
        id, name, title, subtitle, plot,
        width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT,
        src, margin,
        basePath, data,
        filter,
        children,
    }: Plot<T>
) {
    const [ initialized, setInitialized ] = useState(false)
    const [ computedHeight, setComputedHeight ] = useState<number | null>(null)
    const [ showLegend, setShowLegend ] = useState(true)
    const [ xRange, setXRange ] = useState<null | [number, number]>(null)
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
        data: plotData,
        layout,
        style
    } = plot
    const {
        title: plotTitle, margin: plotMargin, xaxis, yaxis, template, height: plotHeight,
        ...rest
    } = layout
    if (!data && (subtitle instanceof Function || children instanceof Function)) {
        console.warn("`data` missing for subtitle/children functions:", data, subtitle, children)
    }
    basePath = basePath || getBasePath() || ""
    const nodeArg: NodeArg<T> = { ...layout, ...(data || {} as T) }
    const renderedSubtitle = subtitle instanceof Function ? subtitle(nodeArg) : subtitle
    const renderedChildren = children instanceof Function ? children(nodeArg) : children
    height = computedHeight !== null ? computedHeight : (typeof style?.height === 'number' ? style?.height : height)
    margin = { ...DEFAULT_MARGIN, ...plotMargin, ...margin }
    name = name || id
    if (src === undefined) {
        src = `plots/${name}.png`
    }
    const newLayout: Partial<Layout> = {
        margin,
        xaxis: {
            // range: xRange || undefined,
            ...(xaxis || {}),
        },
        yaxis: {
            automargin: true,
            gridcolor: "#ccc",
            autorange: true,
            // rangemode: xRange ? "normal" : "tozero",
            // domain: [0, 1],
            // range: yRange || undefined,
            // tickmode: "linear",
            // tick0: 0,
            // dtick: 100,
            //autorange: true,
            fixedrange: true,
            // ...(yaxis || {}),
        },
        height,
        //showlegend: showLegend,
        autosize: true,
        // dragMode: false,
        dragmode: "zoom",
        ...rest
    }

    const filteredTraces: PlotData[] = useMemo(() => {
        const data = plotData as PlotData[]
        return (filter && xRange) ? filter({ data, xRange }) : data
    }, [ xRange, filter ])

    // console.log(`${name} data:`, plotData)
    // console.log(`${name} filteredTraces:`, filteredTraces)
    // console.log(`${name} original layout:`, layout, "rest:", rest)
    // console.log(`${name} layout:`, newLayout)
    return (
        <div id={id} key={id} className={css.plot}>
            <h2><a href={`#${id}`}>{title}</a></h2>
            {renderedSubtitle}
            <div className={css.plotWrapper}>
                <div className={`${css.fallback} ${initialized ? css.hidden : ""}`} style={{ height: `${height}px`, maxHeight: `${height}px` }}>{
                    src && <>
                        <Image
                            alt={title}
                            src={`${basePath}/${src}`}
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
/*
                    onLegendClick={e => {
                        console.log("legend click:", e)
                        setShowLegend(false)
                        return false
                    }}
*/
                    onDoubleClick={() => setXRange(null)}
                    onRelayout={e => {
                        if (!('xaxis.range[0]' in e && 'xaxis.range[1]' in e)) return
                        console.log(e)
                        let [start, end] = [e['xaxis.range[0]'] as number, e['xaxis.range[1]'] as number,]//.map(s => s ? new Date(s) : undefined)
                        console.log("start, end", start, end)
                        start = Math.round(start - 0.5) + 0.5
                        end = Math.round(end + 0.5) - 0.5
                        console.log("after rounding", start, end)
                        setXRange([start, end])
                    }}
                    className={css.plotly}
                    data={filteredTraces}
                    config={{ displayModeBar: false, scrollZoom: false, responsive: true, }}
                    style={{ ...style, visibility: initialized ? undefined : "hidden", width: "100%" }}
                    layout={newLayout}
                    // onClick={() => setInitialized(false)}
                />

            </div>
            {renderedChildren}
        </div>
    )
}
