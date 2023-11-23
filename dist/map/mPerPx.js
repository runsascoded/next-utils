import { useMemo } from "react";
export function getMetersPerPixel(map) {
    const centerLatLng = map.getCenter(); // get map center
    const pointC = map.latLngToContainerPoint(centerLatLng); // convert to containerpoint (pixels)
    const pointX = [pointC.x + 1, pointC.y]; // add one pixel to x
    // const pointY: L.PointExpression = [pointC.x, pointC.y + 1]; // add one pixel to y
    // convert containerpoints to latlng's
    const latLngC = map.containerPointToLatLng(pointC);
    const latLngX = map.containerPointToLatLng(pointX);
    // const latLngY = map.containerPointToLatLng(pointY);
    const distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)
    // const distanceY = latLngC.distanceTo(latLngY); // calculate distance between c and y (longitude)
    // const zoom = map.getZoom()
    //console.log("distanceX:", distanceX, "distanceY:", distanceY, "center:", centerLatLng, "zoom:", zoom)
    return distanceX;
}
export function useMetersPerPixel(map, zoom) {
    return useMemo(() => getMetersPerPixel(map), [map, zoom,]);
}
