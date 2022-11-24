import React, { useEffect, useState } from "react";
// import css from './nav.module.css'
import css, { absolute } from './nav.css';
export function toggleHamburger(id, open) {
    const x = document.getElementById(id);
    if (!x)
        return;
    open = open || (open === undefined && !x.classList.contains("open"));
    if (open) {
        x.classList.add("open");
    }
    else {
        x.classList.remove("open");
    }
}
export function Nav({ id, menus, children, }) {
    const [scrollY, setScrollY] = useState(0);
    const [clickScroll, setClickScroll] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            const nav = document === null || document === void 0 ? void 0 : document.getElementById(id);
            if (!nav)
                return;
            const height = nav.offsetHeight;
            const curScrollY = window.scrollY;
            if (scrollY && !clickScroll && curScrollY >= scrollY) {
                // User scrolled down:
                if (curScrollY < height) {
                    // begin edging nav offscreen if still at top of page
                    nav.classList.add(absolute);
                    nav.style.top = `0`;
                }
                else {
                    // hide nav otherwise
                    nav.style.top = `-${height}px`;
                }
            }
            else {
                nav.classList.remove(absolute);
                nav.style.top = "0";
            }
            //console.log("scroll:", scrollY, "→", curScrollY, "clickScroll:", clickScroll, "nav.style.top:", nav.style.top)
            setScrollY(curScrollY);
            setClickScroll(false);
        };
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [clickScroll, setClickScroll, scrollY, setScrollY]);
    return (React.createElement("div", { id: id, className: css.topnav, onClick: () => { setClickScroll(true); } },
        React.createElement("button", { key: "hamburger", className: css.icon, onClick: () => toggleHamburger(id) }, "\u2630"),
        menus.map(({ id, name, sections }) => {
            if (sections) {
                return React.createElement("div", { key: name, className: `${css.dropdown} ${css.menu}` },
                    React.createElement("button", { className: css.dropbtn },
                        "Wards",
                        React.createElement("i", { className: "fa fa-caret-down" })),
                    React.createElement("div", { className: css.dropdownContent }, sections.map(({ id, name }) => React.createElement("a", { key: id, href: `#${id}` }, name))));
            }
            else {
                return React.createElement("a", { key: name, href: `#${id}`, className: css.menu }, name);
            }
        }),
        children));
}
