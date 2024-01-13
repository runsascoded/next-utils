import React, { ReactNode, useMemo, useState } from "react";
import * as css from "./plot.css"
import { PlotParams } from "react-plotly.js";
import { Datum, Layout, Legend, Margin, PlotData } from "plotly.js";
import { fromEntries, o2a } from "./objs"
import PlotWrapper, { DEFAULT_HEIGHT, DEFAULT_MARGIN, DEFAULT_WIDTH } from "./plot-wrapper";

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
    name: string
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
    params: PlotParams
    title: string
    margin?: Partial<Margin>
    width?: number
    height?: number
    data?: T
    basePath?: string
}

export function buildPlot<T = {}>(
    spec: PlotSpec<T>,
    params: PlotParams,
    data: T,
): Plot<T> {
    const id = spec.id
    let title = spec.title
    if (!title) {
        const plotTitle = params.layout.title
        if (typeof plotTitle === 'string') {
            title = plotTitle
        } else if (plotTitle?.text) {
            title = plotTitle.text
        } else {
            throw `No title found for plot ${id}`
        }
    }
    return { ...spec, title, params, data }
}

export function buildPlots<T = {}>(
    specs: PlotSpec<T>[],
    plots: { [id: string]: PlotParams },
    data: T,
): Plot<T>[] {
    const plotSpecDict: { [id: string]: PlotSpec<T> } = fromEntries(specs.map(spec => [ spec.id, spec ]))
    return o2a(plots, (id, plot) => {
        const spec = plotSpecDict[id]
        if (!spec) return
        return buildPlot(spec, plot, data)
    }).filter((p): p is Plot<T> => !!p)
}

export function Plot<T = {}>(
    {
        id, name, title, subtitle, params,
        width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT,
        src, margin,
        basePath, data,
        filter,
        children,
    }: Plot<T>
) {
    const {
        data: plotData,
        layout,
    } = params
    const {
        title: plotTitle, margin: plotMargin, xaxis, yaxis, template, height: plotHeight,
        ...rest
    } = layout
    if (!data && (subtitle instanceof Function || children instanceof Function)) {
        console.warn("`data` missing for subtitle/children functions:", data, subtitle, children)
    }
    const [ xRange, setXRange ] = useState<null | [number, number]>(null)
    const nodeArg: NodeArg<T> = { ...layout, ...(data || {} as T) }
    const renderedSubtitle = subtitle instanceof Function ? subtitle(nodeArg) : subtitle
    const renderedChildren = children instanceof Function ? children(nodeArg) : children
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
            <PlotWrapper
                // id={id}
                params={{ ...params, data: filteredTraces, layout: newLayout }}
                src={src}
                alt={title}
                width={width}
                height={height}
                setXRange={setXRange}
                basePath={basePath}
            />
            {renderedChildren}
        </div>
    )
}
