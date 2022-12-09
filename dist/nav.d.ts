import { ReactNode } from "react";
export type Section = {
    name: string;
    id: string;
};
export type Menu = Section & {
    sections?: Section[];
};
export declare function Submenu({ name, sections, hover, log }: {
    name: string;
    sections: Section[];
    hover?: boolean;
    log?: boolean;
}): JSX.Element;
export declare function Nav({ id, classes, theme, menus, hover, log, children, }: {
    id: string;
    classes?: string;
    theme?: string;
    menus: Menu[];
    hover?: boolean;
    log?: boolean;
    children?: ReactNode;
}): JSX.Element;
