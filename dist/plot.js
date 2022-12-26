import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import * as css from "./plot.css";
const Plotly = dynamic(() => import("react-plotly.js"), { ssr: false });
import { fromEntries, o2a } from "./objs";
export const DEFAULT_MARGIN = { t: 0, r: 15, b: 0, l: 0 };
export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 450;
export function build(specs, plots) {
    const plotSpecDict = fromEntries(specs.map(spec => [spec.id, spec]));
    return o2a(plots, (id, plot) => {
        const spec = plotSpecDict[id];
        let title = spec.title;
        if (!title) {
            const plotTitle = plot.layout.title;
            if (typeof plotTitle === 'string') {
                title = plotTitle;
            }
            else if (plotTitle?.text) {
                title = plotTitle.text;
            }
            else {
                throw `No title found for plot ${id}`;
            }
        }
        return { ...spec, title, plot, };
    });
}
export function Plot({ id, title, subtitle, plot, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, src, margin, basePath, data, children, }) {
    const [initialized, setInitialized] = useState(false);
    const { data: plotData, layout, style } = plot;
    const { title: plotTitle, margin: plotMargin, xaxis, yaxis, ...rest } = layout;
    if (!data && (subtitle instanceof Function || children instanceof Function)) {
        console.warn("`data` missing for subtitle/children functions:", data, subtitle, children);
    }
    const nodeArg = { ...layout, ...(data || {}) };
    const renderedSubtitle = subtitle instanceof Function ? subtitle(nodeArg) : subtitle;
    const renderedChildren = children instanceof Function ? children(nodeArg) : children;
    height = style?.height || height;
    margin = { ...DEFAULT_MARGIN, ...plotMargin, ...margin };
    return (React.createElement("div", { id: id, key: id, className: css.plot },
        React.createElement("h2", null,
            React.createElement("a", { href: `#${id}` }, title)),
        renderedSubtitle,
        React.createElement("div", { className: css.plotWrapper },
            React.createElement("div", { className: `${css.fallback} ${initialized ? css.hidden : ""}`, style: { height: `${height}px`, maxHeight: `${height}px` } }, src && React.createElement(React.Fragment, null,
                React.createElement(Image, { alt: title, src: `${basePath}/${src}`, width: width, height: height, 
                    // layout="responsive"
                    loading: "lazy" }),
                React.createElement("div", { className: css.spinner }))),
            React.createElement(Plotly, { onInitialized: () => { setInitialized(true); }, className: css.plotly, data: plotData, layout: {
                    margin,
                    ...(xaxis ? { xaxis } : {}),
                    yaxis,
                    autosize: true,
                    dragmode: false,
                    ...rest
                }, config: { displayModeBar: false, scrollZoom: false, responsive: true, }, style: { ...style, visibility: initialized ? undefined : "hidden", width: "100%" } })),
        renderedChildren));
}
