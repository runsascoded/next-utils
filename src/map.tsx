import React, { ReactElement } from 'react'
import L from 'leaflet'
import * as ReactLeaflet from 'react-leaflet'
import { MapContainerProps } from "react-leaflet/lib/MapContainer"

const _hooks = require("react-leaflet/hooks")

type MapProps = (Omit<MapContainerProps, "children"> & { children: (RL: typeof ReactLeaflet, map: L.Map) => ReactElement<{}> })

function MapConsumer(_ref: { children: (map: L.Map) => ReactElement<{}> }) {
    let { children } = _ref
    return children(_hooks.useMap())
}

const Map = ({ children, /*className, */...rest }: MapProps) => {
    const MapContainer = ReactLeaflet.MapContainer
    return (
        <MapContainer {...rest}>
            <MapConsumer>{
                (map: L.Map) => children(ReactLeaflet, map)
            }</MapConsumer>
        </MapContainer>
    )
}

export default Map
