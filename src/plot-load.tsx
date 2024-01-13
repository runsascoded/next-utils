import {fromEntries} from "./objs";
import {loadSync} from "./load";
import {PlotParams} from "react-plotly.js";
import {CSSProperties} from "react";
import { PlotsDict, PlotSpec } from "./plot";

export function loadPlot<T = {}>(spec: PlotSpec<T>, dir: string = "public/plots"): PlotParams {
    const { id, name, style } = spec
    const plot = loadSync<PlotParams>(`${dir}/${name || id}.json`)
    if (style) {
        plot.style = style as (CSSProperties | undefined)
    }
    return plot
}

export function loadPlots<T = {}>(specs: PlotSpec<T>[], dir: string = "public/plots"): PlotsDict {
    return fromEntries(
        specs.map(spec => {
            const plot = loadPlot(spec)
            return [ spec.id, plot ]
        })
    )
}
