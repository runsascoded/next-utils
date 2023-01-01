import { ReactNode } from "react";
export type Social = {
    name: string;
    href: string;
    src: ReactNode;
    alt?: string;
    title: string;
    basePath?: string;
};
export type Site = {
    name: string;
    user: string;
    title?: string;
    domain?: string;
    src?: ReactNode;
    href?: string;
    alt?: string;
};
export declare const site: ({ name, user, title, domain, src, href, alt, }: Site) => Social;
export declare function GitHubSvg(className?: string): JSX.Element;
export declare const TwitterSvg: JSX.Element;
export declare const InstagramSvg: JSX.Element;
export declare const YouTubeSvg: JSX.Element;
export declare const GitHub: (user: string, className?: string, rest?: Partial<Site>) => Social;
export declare const Twitter: (user: string, rest?: Partial<Site>) => Social;
export declare const YouTube: (user: string, rest?: Partial<Site>) => Social;
export declare const Instagram: (user: string, rest?: Partial<Site>) => Social;
export declare function Social({ name, href, src, alt, title, basePath }: Social): JSX.Element;
export declare function Socials({ socials, className }: {
    socials: Social[];
    className?: string;
}): JSX.Element;
