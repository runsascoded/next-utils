import React from "react";
import Link from "next/link";
export default function A({ href, ref, children, ...attrs }) {
    if (href && (href.startsWith("/") || href.startsWith("#"))) {
        if (ref) {
            console.warn(`Dropping anchor ref ${ref}`, { href, ...attrs });
        }
        return React.createElement(Link, { href: href, ...attrs }, children);
    }
    else {
        const { target = "_blank", rel = "noreferrer", ...rest } = attrs;
        return React.createElement("a", { href: href, target: target, rel: rel, ref: ref, ...rest }, children);
    }
}
