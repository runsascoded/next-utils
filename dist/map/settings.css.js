import { style, globalStyle } from "@vanilla-extract/css";
export const container = style({
    position: "fixed",
    padding: "0.5em",
    bottom: "0.5em",
    right: "0.5em",
    zIndex: 1000,
});
export const gear = "gear";
globalStyle(`${container} .${gear}`, {
    fontSize: "2.5em",
    color: "white",
});
export const settings = style({
    position: "relative",
    display: "inline-block",
});
export const menu = "menu";
globalStyle(`${settings} .${menu}`, {
    //width: "8em",
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    borderRadius: "3px",
    padding: "5px 0",
    position: "absolute",
    zIndex: 1,
    bottom: "1em",
    right: "105%",
});
export const icons = style({
    textAlign: "center",
    marginTop: "0.6em",
    marginBottom: "0.3em",
});
export const icon = "icon";
globalStyle(`${icons} .${icon}`, {
    marginLeft: "0.5em",
    maxHeight: "1.5em",
});
export default { container, gear, settings, menu, icons, icon, };
