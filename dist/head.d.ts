import { ReactNode } from "react";
export type Head = {
    title: string;
    description?: string;
    type?: string;
    url: string;
    thumbnail: string;
    favicon?: string;
    twitterCard?: string;
    children?: ReactNode;
};
export declare function Head({ title, description, type, url, thumbnail, favicon, twitterCard, children, }: Head): JSX.Element;
