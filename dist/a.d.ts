import { DetailedHTMLProps, AnchorHTMLAttributes } from "react";
export type AProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
export default function A({ href, ref, children, ...attrs }: AProps): JSX.Element;
