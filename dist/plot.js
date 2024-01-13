import React, { useMemo, useState } from "react";
import * as css from "./plot.css";
import { fromEntries, o2a } from "./objs";
import PlotWrapper, { DEFAULT_HEIGHT, DEFAULT_MARGIN, DEFAULT_WIDTH } from "./plot-wrapper";
export const filterIdxs = ({ data, xRange, }) => {
    const xs = Math.round(xRange[0]);
    const xe = Math.round(xRange[1]);
    return data.map(({ x, y, ...trace }) => ({
        x: x.slice(xs, xe),
        y: y.slice(xs, xe),
        ...trace,
    }));
};
export const filterValues = ({ keepNull, mapRange }) => ({ data, xRange }) => {
    keepNull = keepNull || keepNull === undefined;
    const [xs, xe] = mapRange ? mapRange(xRange) : xRange;
    // xs = Math.round(xs - 0.5) + 0.5
    // xe = Math.round(xe + 0.5) - 0.5
    return data.map(({ x, y, ...trace }) => {
        x = x;
        y = y;
        const enumerated = x.map((v, idx) => [v, idx]).filter(([v]) => (v === null ? keepNull : (xs <= v && v <= xe)));
        const idxs = enumerated.map(([v, idx]) => idx);
        return {
            x: enumerated.map(([v]) => v),
            y: y.filter((v, idx) => idxs.includes(idx)),
            ...trace,
        };
    });
};
export const HalfRoundWiden = ([xs, xe]) => {
    xs = Math.round(xs - 0.5) + 0.5;
    xe = Math.round(xe + 0.5) - 0.5;
    return [xs, xe];
};
export function buildPlot(spec, params, data) {
    const id = spec.id;
    let title = spec.title;
    if (!title) {
        const plotTitle = params.layout.title;
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
    return { ...spec, title, params, data };
}
export function buildPlots(specs, plots, data) {
    const plotSpecDict = fromEntries(specs.map(spec => [spec.id, spec]));
    return o2a(plots, (id, plot) => {
        const spec = plotSpecDict[id];
        if (!spec)
            return;
        return buildPlot(spec, plot, data);
    }).filter((p) => !!p);
}
export function Plot({ id, name, title, subtitle, params, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, src, margin, basePath, data, filter, children, }) {
    const { data: plotData, layout, } = params;
    const { title: plotTitle, margin: plotMargin, xaxis, yaxis, template, height: plotHeight, ...rest } = layout;
    if (!data && (subtitle instanceof Function || children instanceof Function)) {
        console.warn("`data` missing for subtitle/children functions:", data, subtitle, children);
    }
    const [xRange, setXRange] = useState(null);
    const nodeArg = { ...layout, ...(data || {}) };
    const renderedSubtitle = subtitle instanceof Function ? subtitle(nodeArg) : subtitle;
    const renderedChildren = children instanceof Function ? children(nodeArg) : children;
    margin = { ...DEFAULT_MARGIN, ...plotMargin, ...margin };
    name = name || id;
    if (src === undefined) {
        src = `plots/${name}.png`;
    }
    const newLayout = {
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
    };
    const filteredTraces = useMemo(() => {
        const data = plotData;
        return (filter && xRange) ? filter({ data, xRange }) : data;
    }, [xRange, filter]);
    // console.log(`${name} data:`, plotData)
    // console.log(`${name} filteredTraces:`, filteredTraces)
    // console.log(`${name} original layout:`, layout, "rest:", rest)
    // console.log(`${name} layout:`, newLayout)
    return (React.createElement("div", { id: id, key: id, className: css.plot },
        React.createElement("h2", null,
            React.createElement("a", { href: `#${id}` }, title)),
        renderedSubtitle,
        React.createElement(PlotWrapper
        // id={id}
        , { 
            // id={id}
            params: { ...params, data: filteredTraces, layout: newLayout }, src: src, alt: title, width: width, height: height, setXRange: setXRange, basePath: basePath }),
        renderedChildren));
}
