import React, {ReactNode, useEffect, useState} from "react";
// import css from './nav.module.css'
import css, {absolute} from './nav.css'

export function toggleHamburger(id: string, open?: boolean) {
    const x = document.getElementById(id);
    if (!x) return;
    open = open || (open === undefined && !x.classList.contains("open"))
    if (open) {
        x.classList.add("open")
    } else {
        x.classList.remove("open")
    }
}

export type Section = {
    name: string
    id: string
}
export type Menu = {
    sections?: Section[]
} & Section

export function Nav({ id, menus, children, }: {
    id: string
    menus: Menu[]
    children?: ReactNode
}) {
    const [scrollY, setScrollY] = useState(0);
    const [clickScroll, setClickScroll] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            const nav = document?.getElementById(id)
            if (!nav) return
            const height = nav.offsetHeight
            const curScrollY = window.scrollY;
            if (scrollY && !clickScroll && curScrollY >= scrollY) {
                // User scrolled down:
                if (curScrollY < height) {
                    // begin edging nav offscreen if still at top of page
                    nav.classList.add(absolute)
                    nav.style.top = `0`
                } else {
                    // hide nav otherwise
                    nav.style.top = `-${height}px`;
                }
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
        <div id={id} className={css.topnav} onClick={() => { setClickScroll(true) }}>
            <button key={"hamburger"} className={css.icon} onClick={() => toggleHamburger(id)}>&#9776;</button>
            {
                menus.map(({ id, name, sections }) => {
                    if (sections) {
                        return <div key={name} className={`${css.dropdown} ${css.menu}`}>
                            <button className={css.dropbtn}>Wards
                                <i className="fa fa-caret-down"></i>
                            </button>
                            <div className={css.dropdownContent}>{
                                sections.map(({ id, name }) => <a key={id} href={`#${id}`}>{name}</a>)
                            }
                            </div>
                        </div>
                    } else {
                        return <a key={name} href={`#${id}`} className={css.menu}>{name}</a>
                    }
                })
            }
            {children}
        </div>
    )
}
