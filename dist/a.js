import React from "react";
export default function A({ children, target = "_blank", rel = "noreferrer", ...attrs }) {
    return React.createElement("a", { ...attrs, target: target, rel: rel }, children);
}
