import { DetailedHTMLProps, AnchorHTMLAttributes } from "react";
export type AProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
export default function A({ children, target, rel, ...attrs }: AProps): JSX.Element;
