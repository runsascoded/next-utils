import {globalStyle, keyframes, style} from '@vanilla-extract/css'

export const plot = style({
    width: "100%",
})

export const plotly = "plotly"
globalStyle(`${plot} .${plotly}`, {
    width: "100%",
    position: "absolute",
    top: 0,
})

export const plotWrapper = "plot-wrapper"
globalStyle(`${plot} .${plotWrapper}`, {
    position: "relative",
    maxHeight: "95vh",
    overflow: "hidden",
})

export const mapboxControls = "mapboxgl-ctrl-logo"
globalStyle(`${plot} .${plotWrapper} .${mapboxControls}`, {
    display: "none !important",
})

export const legendToggle = "legend-toggle"
globalStyle(`${plot} .${plotWrapper} .${legendToggle}`, {
    position: "absolute",
    cursor: "pointer",
    right: "1.3em",
    bottom: "0.23em",
    fontSize: "1.8em",
    color: "grey",
    zIndex: 100,
})

export const plotLegend = "legend"
globalStyle(`${plot} .${plotWrapper} .${plotLegend}`, {
    transition: "display 0.5s, visibility 0.5s, opacity 0.5s",
})

export const fallback = "fallback"
globalStyle(`${plot} .${fallback}`, {
    position: "relative",
    top: 0,
    width: "100%",
    backgroundColor: "rgba(250,250,250,0.8)",
})

globalStyle(`${plot} .${fallback} img`, {
    zIndex: -1,
})

export const spin = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
});

export const spinner = "spinner"
globalStyle(`${plot} .${fallback} .${spinner}`, {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: "auto",
    border: "16px solid #aaf",
    borderTop: "16px solid #117",
    borderRadius: "50%",
    width: "5em",
    height: "5em",
    animation: `${spin} 2s linear infinite`,
})

export const hidden = "hidden"
globalStyle(`${plot} .${hidden}`, {
    visibility: "hidden",
})

/*
.fallback img {
    z-index: -1;
}
 */

/*
.plot-container, .plot-body, .plot {
    width: 100%;
}
*/
