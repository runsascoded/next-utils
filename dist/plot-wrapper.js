import * as css from "./plot.css";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getBasePath } from "./basePath";
const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });
export const DEFAULT_MARGIN = { t: 0, r: 15, b: 0, l: 0 };
export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 450;
export default function PlotWrapper({ params, src, alt, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, setXRange, basePath, }) {
    const [initialized, setInitialized] = useState(false);
    const [computedHeight, setComputedHeight] = useState(null);
    const [showLegend, setShowLegend] = useState(true);
    const legendRef = useRef(null);
    // console.log("render: showLegend", showLegend)
    useEffect(() => {
        // if (!showLegend) return
        const legend = legendRef.current;
        if (!legend) {
            console.log("No legend");
            return;
        }
        if (showLegend) {
            legend.style.opacity = "1";
            legend.style.display = "";
            // legend.classList.remove("hidden")
        }
        else {
            legend.style.opacity = "0";
            legend.style.display = "none";
            // legend.classList.add("hidden")
        }
    }, [showLegend, initialized,]);
    const { data, layout, style } = params;
    height = computedHeight !== null ? computedHeight : (typeof style?.height === 'number' ? style?.height : height);
    basePath = basePath || getBasePath() || "";
    src = `${basePath}/${src}`;
    return (
    // <div className={css.plot}>
    React.createElement("div", { className: css.plotWrapper },
        React.createElement("div", { className: `${css.fallback} ${initialized ? css.hidden : ""}`, style: { height: `${height}px`, maxHeight: `${height}px` } }, src && React.createElement(React.Fragment, null,
            React.createElement(Image, { alt: alt, src: src, width: width, height: height, 
                // layout="responsive"
                loading: "lazy" }),
            React.createElement("div", { className: css.spinner }))),
        React.createElement(Plotly, { onInitialized: (fig, div) => {
                const parent = div.offsetParent;
                const [legend] = div.getElementsByClassName('legend');
                legendRef.current = legend;
                // setInitialized(true)
                setComputedHeight(parent.offsetHeight);
            }, onDoubleClick: () => {
                if (setXRange) {
                    setXRange(null);
                }
            }, onLegendClick: e => {
                const { curveNumber, data } = e;
                const { name } = data[curveNumber];
                console.log(`legend click: ${name}`, e);
                return true;
            }, onLegendDoubleClick: e => {
                const { curveNumber, data } = e;
                const { name } = data[curveNumber];
                console.log(`legend double click ${name}:`, e);
                return true;
            }, onRelayout: e => {
                console.log("relayout:", e);
                if (!('xaxis.range[0]' in e && 'xaxis.range[1]' in e))
                    return;
                console.log(e);
                let [start, end] = [e['xaxis.range[0]'], e['xaxis.range[1]'],]; //.map(s => s ? new Date(s) : undefined)
                console.log("start, end", start, end);
                start = Math.round(start - 0.5) + 0.5;
                end = Math.round(end + 0.5) - 0.5;
                console.log("after rounding", start, end);
                if (setXRange) {
                    setXRange([start, end]);
                }
            }, className: css.plotly, data: data, config: { displayModeBar: false, scrollZoom: false, responsive: true, }, style: { ...style, visibility: initialized ? undefined : "hidden", width: "100%" }, layout: layout }))
    // </div>
    );
}
