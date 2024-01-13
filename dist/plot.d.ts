import React, { ReactNode } from "react";
import { PlotParams } from "react-plotly.js";
import { Layout, Legend, Margin, PlotData } from "plotly.js";
export type NodeArg<T> = Partial<Layout> & T;
export type NodeFn<T> = (t: NodeArg<T>) => ReactNode;
export type Node<T> = ReactNode | NodeFn<T>;
export type PlotsDict = {
    [id: string]: PlotParams;
};
export type XRange = [number, number];
export type FilterArgs = {
    data: PlotData[];
    xRange: XRange;
};
export type Filter = (_: FilterArgs) => PlotData[];
export declare const filterIdxs: Filter;
export type FilterValuesArgs = {
    keepNull?: boolean;
    mapRange?: (xRange: XRange) => XRange;
};
export declare const filterValues: ({ keepNull, mapRange }: FilterValuesArgs) => Filter;
export declare const HalfRoundWiden: (xRange: XRange) => XRange;
export type PlotSpec<T = {}> = {
    id: string;
    name: string;
    menuName?: string;
    dropdownSection?: string;
    title?: string;
    style?: React.CSSProperties;
    legend?: "inherit" | Legend;
    src?: string;
    subtitle?: Node<T>;
    filter?: Filter;
    children?: Node<T>;
};
export type Plot<T = {}> = PlotSpec<T> & {
    params: PlotParams;
    title: string;
    margin?: Partial<Margin>;
    width?: number;
    height?: number;
    data?: T;
    basePath?: string;
};
export declare function buildPlot<T = {}>(spec: PlotSpec<T>, params: PlotParams, data: T): Plot<T>;
export declare function buildPlots<T = {}>(specs: PlotSpec<T>[], plots: {
    [id: string]: PlotParams;
}, data: T): Plot<T>[];
export declare function Plot<T = {}>({ id, name, title, subtitle, params, width, height, src, margin, basePath, data, filter, children, }: Plot<T>): JSX.Element;
