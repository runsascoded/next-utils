import { PlotsDict, PlotSpec } from "./plot";
export default function load<T = {}>(specs: PlotSpec<T>[], dir?: string): PlotsDict;
