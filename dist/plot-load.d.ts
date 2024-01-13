import { PlotParams } from "react-plotly.js";
import { PlotsDict, PlotSpec } from "./plot";
export declare function loadPlot<T = {}>(spec: PlotSpec<T>, dir?: string): PlotParams;
export declare function loadPlots<T = {}>(specs: PlotSpec<T>[], dir?: string): PlotsDict;
