import React, { ReactNode } from "react";
import { PlotParams } from "react-plotly.js";
import { Layout, Legend, Margin } from "plotly.js";
export type NodeArg<T> = Partial<Layout> & T;
export type NodeFn<T> = (t: NodeArg<T>) => ReactNode;
export type Node<T> = ReactNode | NodeFn<T>;
export type PlotSpec<T> = {
    id: string;
    name: string;
    menuName?: string;
    dropdownSection?: string;
    title?: string;
    style?: React.CSSProperties;
    legend?: "inherit" | Legend;
    src?: string;
    subtitle?: Node<T>;
    children?: Node<T>;
};
export type Plot<T> = PlotSpec<T> & {
    plot: PlotParams;
    title: string;
    margin?: Partial<Margin>;
    width?: number;
    height?: string | number;
    data?: T;
    basePath?: string;
};
export declare const DEFAULT_MARGIN: {
    t: number;
    r: number;
    b: number;
    l: number;
};
export declare const DEFAULT_WIDTH = 800;
export declare const DEFAULT_HEIGHT = 450;
export declare function Plot<T>({ id, title, subtitle, plot, width, height, src, margin, basePath, data, children, }: Plot<T>): JSX.Element;
