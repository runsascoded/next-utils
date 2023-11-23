import { ReactElement } from 'react';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import { MapContainerProps } from "react-leaflet/lib/MapContainer";
type MapProps = (Omit<MapContainerProps, "children"> & {
    children: (RL: typeof ReactLeaflet, map: L.Map) => ReactElement<{}>;
});
declare const Map: ({ children, ...rest }: MapProps) => JSX.Element;
export default Map;
