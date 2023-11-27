import { Dispatch, ReactNode } from "react";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
export type Icon = {
    src: string;
    alt: string;
    href: string;
    key?: string;
    title?: string;
    className?: string;
};
export type Props = {
    icons?: Icon[];
    show?: [boolean, Dispatch<boolean>];
    className?: string;
    icon?: IconProp;
    children?: ReactNode;
};
export declare const SettingsGear: ({ icons, show, className, icon, children }: Props) => JSX.Element;
