import React, {DetailedHTMLProps, AnchorHTMLAttributes} from "react";
import Link from "next/link";

export type AProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

export default function A({ href, ref, children, ...attrs }: AProps) {
    if (href && (href.startsWith("/") || href.startsWith("#"))) {
        if (ref) {
            console.warn(`Dropping anchor ref ${ref}`, { href, ...attrs })
        }
        return <Link href={href} {...attrs}>{children}</Link>
    } else {
        const { target = "_blank", rel = "noreferrer", ...rest } = attrs
        return <a href={href} target={target} rel={rel} ref={ref} {...rest}>{children}</a>
    }
}
