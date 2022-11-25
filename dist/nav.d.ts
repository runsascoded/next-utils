import { ReactNode } from "react";
export type Section = {
    name: string;
    id: string;
};
export type Menu = Section & {
    sections?: Section[];
};
export declare function Submenu({ name, sections }: {
    name: string;
    sections: Section[];
}): JSX.Element;
export declare function Nav({ id, classes, theme, menus, children, }: {
    id: string;
    classes?: string;
    theme?: string;
    menus: Menu[];
    children?: ReactNode;
}): JSX.Element;
