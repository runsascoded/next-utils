import { Dispatch } from "react";
import { PlotParams } from "react-plotly.js";
export type Props = {
    params: PlotParams;
    src: string;
    alt: string;
    width?: number;
    height?: number;
    setXRange?: Dispatch<[number, number] | null>;
    basePath?: string;
    className?: string;
};
export declare const DEFAULT_MARGIN: {
    t: number;
    r: number;
    b: number;
    l: number;
};
export declare const DEFAULT_WIDTH = 800;
export declare const DEFAULT_HEIGHT = 450;
export default function PlotWrapper({ params, src, alt, width, height, setXRange, basePath, className, }: Props): JSX.Element;
