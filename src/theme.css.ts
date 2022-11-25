import {vars} from "./contract.css"
import {createTheme} from "@vanilla-extract/css";

export const dark = createTheme(vars, {
    color: "white",
    linkColor: "#f2f2f2",
    backgroundColor: "black",
})
