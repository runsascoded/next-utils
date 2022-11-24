import { ReactNode } from "react";
export declare function toggleHamburger(id: string, open?: boolean): void;
export type Section = {
    name: string;
    id: string;
};
export type Menu = {
    sections?: Section[];
} & Section;
export declare function Nav({ id, menus, children, }: {
    id: string;
    menus: Menu[];
    children?: ReactNode;
}): JSX.Element;
