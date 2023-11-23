import React from 'react';
import * as ReactLeaflet from 'react-leaflet';
const _hooks = require("react-leaflet/hooks");
function MapConsumer(_ref) {
    let { children } = _ref;
    return children(_hooks.useMap());
}
const Map = ({ children, /*className, */ ...rest }) => {
    const MapContainer = ReactLeaflet.MapContainer;
    return (React.createElement(MapContainer, { ...rest },
        React.createElement(MapConsumer, null, (map) => children(ReactLeaflet, map))));
};
export default Map;
