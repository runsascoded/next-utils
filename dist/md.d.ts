import { DetailedHTMLProps, HTMLAttributes } from "react";
export declare function sanitizeElement(elem: any): string;
export declare const ID_RGX = " id=([a-zA-Z0-9-']+)$";
export declare function extractId(s: string): {
    id: string;
    title: string;
} | {
    title: string;
    id?: undefined;
};
type Props = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
export declare const renderHeading: (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", props: Props) => JSX.Element;
export type Components = import("mdx/types").MDXComponents;
export declare const components: Components;
export default function Markdown({ content, className }: {
    content: string;
    className?: string;
}): JSX.Element;
export {};
