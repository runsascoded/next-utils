import React, {MouseEvent, MouseEventHandler, ReactNode, useEffect, useState} from "react";
import css, {absolute} from './nav.css'
import {dark} from './contract.css'

export type Section = {
    name: string
    id: string
}
export type Menu = Section & {
    sections?: Section[]
}

export function Submenu({ name, sections, hover = true, log }: { name: string, sections: Section[], hover?: boolean, log?: boolean }) {
    const [open, setOpen] = useState("")
    const onMouseEnter: MouseEventHandler<HTMLDivElement> = ((e: MouseEvent<HTMLDivElement>) => { log && console.log("dropdown onMouseEnter"); setOpen(hover ? css.open : css.hover) ; e.stopPropagation()})
    const onMouseLeave: MouseEventHandler<HTMLDivElement> = ((e: MouseEvent<HTMLDivElement>) => { log && console.log("dropdown onMouseLeave"); setOpen("") })
    return (
        <div
            className={`${css.dropdown} ${css.menu} ${open}`}
            {...{ onMouseEnter, onMouseLeave }}
        >
            <button
                className={css.dropbtn}
                onClick={e => {
                    log && console.log("dropdown onClick")
                    e.stopPropagation()
                    setOpen(open == css.open ? "" : css.open)
                }}
            >
                {name} <i className={`fa fa-caret-${open == css.open ? "down" : "right"}`} />
            </button>
            <div className={css.dropdownContent}>{
                sections.map(
                    ({ id, name }) =>
                        <a key={id} href={`#${id}`}>{name}</a>
                )
            }</div>
        </div>
    )
}

export function Nav({ id, classes = "", theme = dark, menus, hover, log, children, }: {
    id: string
    classes?: string
    theme?: string
    menus: Menu[]
    hover?: boolean
    log?: boolean
    children?: ReactNode
}) {
    const [scrollY, setScrollY] = useState(0);
    const [clickScroll, setClickScroll] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const nav = document?.getElementById(id)
            if (!nav) return
            const height = nav.offsetHeight
            const curScrollY = window.scrollY;
            if (scrollY && !clickScroll && curScrollY >= scrollY) {
                // User scrolled down:
                nav.style.top = `-${height}px`;
            } else {
                nav.classList.remove(absolute)
                nav.style.top = "0";
            }
            //console.log("scroll:", scrollY, "→", curScrollY, "clickScroll:", clickScroll, "nav.style.top:", nav.style.top)
            setScrollY(curScrollY);
            setClickScroll(false)
        }
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [ clickScroll, setClickScroll, scrollY, setScrollY ]);

    return (
        <div
            id={id}
            className={`${css.topnav} ${classes} ${theme} ${open ? css.open : ""}`}
            onClick={() => { log && console.log("nav onClick"); setOpen(!open); setClickScroll(true) }}
            onMouseEnter={() => { log && console.log("nav onMouseEnter"); setOpen( true) }}
            onMouseLeave={() => { log && console.log("nav onMouseLeave"); setOpen(false) }}
        >
            <button key={"hamburger"} className={css.hamburger}>&#9776;</button>
            {
                menus.map(({ id, name, sections }) =>
                    sections
                        ? <Submenu key={name} name={name} sections={sections} hover={hover} log={log} />
                        : <a key={name} href={`#${id}`} className={css.menu}>{name}</a>
                )
            }
            {children}
        </div>
    )
}
