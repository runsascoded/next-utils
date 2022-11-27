import React, {DetailedHTMLProps, AnchorHTMLAttributes} from "react";

export type AProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export default function A({ children, target = "_blank", rel = "noreferrer", ...attrs }: AProps) {
    return <a {...attrs} target={target} rel={rel}>{children}</a>
}
