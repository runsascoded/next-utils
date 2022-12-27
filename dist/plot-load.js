import { fromEntries } from "./objs";
import { loadSync } from "./load";
export default function load(specs, dir = "public/plots") {
    return fromEntries(specs.map(({ id, name, style }) => {
        const plot = loadSync(`${dir}/${name || id}.json`);
        if (style) {
            plot.style = style;
        }
        return [id, plot];
    }));
}
