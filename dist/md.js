import remarkGfm from "remark-gfm";
import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
const { isArray } = Array;
import { header } from "./md.css";
export function sanitizeElement(elem) {
    if (typeof elem === 'string') {
        return elem.toLowerCase().replaceAll(/\W/g, "-");
    }
    else if (elem?.value) {
        return sanitizeElement(elem.value);
    }
    else if (elem?.children) {
        return sanitizeElement(elem.children);
    }
    else {
        return elem.map(sanitizeElement).join("");
    }
}
export const ID_RGX = ` id=([a-zA-Z0-9-']+)$`;
export function extractId(s) {
    const match = s.match(ID_RGX);
    return match ? { id: match[1], title: s.substring(0, match.index) } : { title: s };
}
export const renderHeading = (Tag, props) => {
    const { children, id, ...rest } = props;
    if (id) {
        return React.createElement(Tag, { ...props });
    }
    // console.log("heading:", children, isArray(children))
    if (typeof children === 'string') {
        const { id, title } = extractId(children);
        return id ? React.createElement(Tag, { id: id, className: header, ...rest },
            React.createElement("a", { href: `#${id}` }, title)) : React.createElement(Tag, { ...props });
    }
    else if (isArray(children)) {
        const prefix = children.slice(0, children.length - 1);
        const last = children[children.length - 1];
        if (typeof last === 'string') {
            const { id, title } = extractId(last);
            const newChildren = prefix.concat([title]);
            return id ? React.createElement(Tag, { id: id, className: header, ...rest },
                React.createElement("a", { href: `#${id}` }, newChildren)) : React.createElement(Tag, { ...props });
        }
    }
    else {
        console.warn("Unrecognized children:", children);
    }
    return React.createElement(Tag, { ...props });
};
export const components = {
    a: ({ href, children }) => React.createElement(Link, { href: href || "#" },
        React.createElement("a", { target: href?.startsWith("http") ? "_blank" : "_self" }, children)),
    img: ({ src, placeholder, ...props }) => {
        //return <Image src={src || ''} {...props} />
        return React.createElement("img", { src: src || '', ...props });
    },
    h1: props => renderHeading("h1", props),
    h2: props => renderHeading("h2", props),
    h3: props => renderHeading("h3", props),
    h4: props => renderHeading("h4", props),
    h5: props => renderHeading("h5", props),
    h6: props => renderHeading("h6", props),
};
export default function Markdown(content) {
    return React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw], components: components }, content);
}
