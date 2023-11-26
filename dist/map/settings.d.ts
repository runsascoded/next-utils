import { Dispatch, ReactNode } from "react";
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
    children?: ReactNode;
};
export declare const SettingsGear: ({ icons, show, className, children }: Props) => JSX.Element;
