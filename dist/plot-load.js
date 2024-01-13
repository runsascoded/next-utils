import { fromEntries } from "./objs";
import { loadSync } from "./load";
export function loadPlot(spec, dir = "public/plots") {
    const { id, name, style } = spec;
    const plot = loadSync(`${dir}/${name || id}.json`);
    if (style) {
        plot.style = style;
    }
    return plot;
}
export function loadPlots(specs, dir = "public/plots") {
    return fromEntries(specs.map(spec => {
        const plot = loadPlot(spec);
        return [spec.id, plot];
    }));
}
