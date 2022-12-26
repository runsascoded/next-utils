import React, {ReactNode, useState} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import * as css from "./plot.css"
import {PlotParams} from "react-plotly.js";
import {Layout, Legend, Margin} from "plotly.js";
const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false })
import {fromEntries, o2a} from "./objs"

export type NodeArg<T> = Partial<Layout> & T
export type NodeFn<T> = (t: NodeArg<T>) => ReactNode
export type Node<T> = ReactNode | NodeFn<T>

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
    children?: Node<T>
}

export type Plot<T = {}> = PlotSpec<T> & {
    plot: PlotParams
    title: string
    margin?: Partial<Margin>
    width?: number
    height?: string | number
    data?: T
    basePath?: string
}

export const DEFAULT_MARGIN = { t: 0, r: 15, b: 0, l: 0 }
export const DEFAULT_WIDTH = 800
export const DEFAULT_HEIGHT = 450

export function build<T = {}>(specs: PlotSpec<T>[], plots: { [id: string]: PlotParams }): Plot<T>[] {
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
        return { ...spec, title, plot, }
    })
}

export function Plot<T = {}>(
    {
        id, title, subtitle, plot,
        width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT,
        src, margin,
        basePath, data,
        children,
    }: Plot<T>
) {
    const [ initialized, setInitialized ] = useState(false)
    const {
        data: plotData,
        layout,
        style
    } = plot
    const {
        title: plotTitle, margin: plotMargin, xaxis, yaxis,
        ...rest
    } = layout
    if (!data && (subtitle instanceof Function || children instanceof Function)) {
        console.warn("`data` missing for subtitle/children functions:", data, subtitle, children)
    }
    const nodeArg: NodeArg<T> = { ...layout, ...(data || {} as T) }
    const renderedSubtitle = subtitle instanceof Function ? subtitle(nodeArg) : subtitle
    const renderedChildren = children instanceof Function ? children(nodeArg) : children
    height = style?.height || height
    margin = { ...DEFAULT_MARGIN, ...plotMargin, ...margin }
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
                <Plotly
                    onInitialized={() => { setInitialized(true) }}
                    className={css.plotly}
                    data={plotData}
                    layout={{
                        margin,
                        ...(xaxis ? { xaxis } : {}),
                        yaxis,
                        autosize: true,
                        dragmode: false,
                        ...rest
                    }}
                    config={{ displayModeBar: false, scrollZoom: false, responsive: true, }}
                    style={{ ...style, visibility: initialized ? undefined : "hidden", width: "100%" }}
                    // onClick={() => setInitialized(false)}
                />
            </div>
            {renderedChildren}
        </div>
    )
}
