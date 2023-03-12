import remarkGfm from "remark-gfm";
import React, {DetailedHTMLProps, HTMLAttributes} from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'
const {isArray} = Array;
import {header} from "./md.css"

export function sanitizeElement(elem: any): string {
    if (typeof elem === 'string') {
        return elem.toLowerCase().replaceAll(/\W/g, "-")
    } else if (elem?.value) {
        return sanitizeElement(elem.value)
    } else if (elem?.children) {
        return sanitizeElement(elem.children)
    } else {
        return elem.map(sanitizeElement).join("")
    }
}

export const ID_RGX = ` id=([a-zA-Z0-9-']+)$`

export function extractId(s: string) {
    const match = s.match(ID_RGX)
    return match ? { id: match[1], title: s.substring(0, match.index) } : { title: s }
}

type Props = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

export const renderHeading = (
    Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    props: Props
) => {
    const { children, id, ...rest } = props
    if (id) {
        return <Tag {...props} />
    }
    // console.log("heading:", children, isArray(children))
    if (typeof children === 'string') {
        const {id, title} = extractId(children)
        return id ? <Tag id={id} className={header} {...rest}><a href={`#${id}`}>{title}</a></Tag> : <Tag {...props} />
    } else if (isArray(children)){
        const prefix = children.slice(0, children.length - 1)
        const last = children[children.length - 1]
        if (typeof last === 'string') {
            const {id, title} = extractId(last)
            const newChildren = prefix.concat([title])
            return id ? <Tag id={id} className={header} {...rest}><a href={`#${id}`}>{newChildren}</a></Tag> : <Tag {...props} />
        }
    } else {
        console.warn("Unrecognized children:", children)
    }
    return <Tag {...props} />
}

export type Components = import("mdx/types").MDXComponents
export const components: Components = {
    a: ({ href, children }) =>
        <Link href={href || "#"} target={href?.startsWith("http") ? "_blank" : "_self"}>
            {children}
        </Link>,
    img: ({ src, placeholder, ...props}) => {
        //return <Image src={src || ''} {...props} />
        return <img src={src || ''} {...props} />
    },
    h1: props => renderHeading("h1", props),
    h2: props => renderHeading("h2", props),
    h3: props => renderHeading("h3", props),
    h4: props => renderHeading("h4", props),
    h5: props => renderHeading("h5", props),
    h6: props => renderHeading("h6", props),
}

export default function Markdown(content: string) {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
    >
        {content}
    </ReactMarkdown>
}
