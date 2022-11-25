import React, {ReactNode, useEffect, useState} from "react";
import css, {absolute} from './nav.css'
import {dark} from './theme.css'

export type Section = {
    name: string
    id: string
}
export type Menu = Section & {
    sections?: Section[]
}

export function Submenu({ name, sections }: { name: string, sections: Section[], }) {
    const [open, setOpen] = useState(false)
    return (
        <div
            className={`${css.dropdown} ${css.menu} ${open ? css.open : ""}`}
            onMouseEnter={(e) => { console.log("dropdown onMouseEnter"); setOpen(true) ; e.stopPropagation()}}
            onMouseLeave={(e) => { console.log("dropdown onMouseLeave"); setOpen(false) }}
        >
            <button
                className={css.dropbtn}
                onClick={e => { console.log("dropdown onClick"); e.stopPropagation(); setOpen(!open) } }
            >
                {name} <i className="fa fa-caret-down" />
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

export function Nav({ id, className = dark, menus, children, }: {
    id: string
    className?: string
    menus: Menu[]
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
            className={`${css.topnav} ${className} ${open ? css.open : ""}`}
            onClick={() => { console.log("nav onClick"); setOpen(!open); setClickScroll(true) }}
            onMouseEnter={() => { console.log("nav onMouseEnter"); setOpen(true) }}
            onMouseLeave={() => { console.log("nav onMouseLeave"); setOpen(false) }}
        >
            <button key={"hamburger"} className={css.hamburger}>&#9776;</button>
            {
                menus.map(({ id, name, sections }) =>
                    sections
                        ? <Submenu key={name} name={name} sections={sections} />
                        : <a key={name} href={`#${id}`} className={css.menu}>{name}</a>
                )
            }
            {children}
        </div>
    )
}
