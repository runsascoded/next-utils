import {fromEntries} from "./objs";
import {loadSync} from "./load";
import {PlotParams} from "react-plotly.js";
import {CSSProperties} from "react";
import {PlotsDict, PlotSpec} from "./plot";

export default function load<T = {}>(specs: PlotSpec<T>[], dir: string = "public/plots"): PlotsDict {
    return fromEntries(
        specs.map(({ id, name, style }: PlotSpec<T>) => {
            const plot = loadSync<PlotParams>(`${dir}/${name || id}.json`)
            if (style) {
                plot.style = style as (CSSProperties | undefined)
            }
            return [ id, plot ]
        })
    )
}
