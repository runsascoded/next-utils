import React, { useEffect, useState } from "react";
import css, { absolute } from './nav.css';
import { dark } from './contract.css';
export function Submenu({ name, sections }) {
    const [open, setOpen] = useState(false);
    return (React.createElement("div", { className: `${css.dropdown} ${css.menu} ${open ? css.open : ""}`, onMouseEnter: (e) => { console.log("dropdown onMouseEnter"); setOpen(true); e.stopPropagation(); }, onMouseLeave: (e) => { console.log("dropdown onMouseLeave"); setOpen(false); } },
        React.createElement("button", { className: css.dropbtn, onClick: e => { console.log("dropdown onClick"); e.stopPropagation(); setOpen(!open); } },
            name,
            " ",
            React.createElement("i", { className: "fa fa-caret-down" })),
        React.createElement("div", { className: css.dropdownContent }, sections.map(({ id, name }) => React.createElement("a", { key: id, href: `#${id}` }, name)))));
}
export function Nav({ id, classes = "", theme = dark, menus, children, }) {
    const [scrollY, setScrollY] = useState(0);
    const [clickScroll, setClickScroll] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            const nav = document?.getElementById(id);
            if (!nav)
                return;
            const height = nav.offsetHeight;
            const curScrollY = window.scrollY;
            if (scrollY && !clickScroll && curScrollY >= scrollY) {
                // User scrolled down:
                nav.style.top = `-${height}px`;
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
    return (React.createElement("div", { id: id, className: `${css.topnav} ${classes} ${theme} ${open ? css.open : ""}`, onClick: () => { console.log("nav onClick"); setOpen(!open); setClickScroll(true); }, onMouseEnter: () => { console.log("nav onMouseEnter"); setOpen(true); }, onMouseLeave: () => { console.log("nav onMouseLeave"); setOpen(false); } },
        React.createElement("button", { key: "hamburger", className: css.hamburger }, "\u2630"),
        menus.map(({ id, name, sections }) => sections
            ? React.createElement(Submenu, { key: name, name: name, sections: sections })
            : React.createElement("a", { key: name, href: `#${id}`, className: css.menu }, name)),
        children));
}
