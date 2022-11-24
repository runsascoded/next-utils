import {style, globalStyle, GlobalStyleRule} from '@vanilla-extract/css'

export const absolute = "absolute"
export const dropbtn = "dropbtn"
export const icon = "icon"
export const menu = "menu"

export const topnav = style({
    backgroundColor: "black",
    position: "fixed", /* Make it stick/fixed */
    top: 0, /* Stay on top */
    width: "100%", /* Full width */
    transition: "top 0.3s", /* Transition effect when sliding down (and up) */
    zIndex: 1,

    '@media': {
        'screen and (max-width: 800px)': {
            width: "auto",
        },
    },
});

/* When the screen is less than 800 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon) */

// const maxHamburgerWidth = 800
function media(selector: string, rule: GlobalStyleRule) {
    globalStyle(`${topnav}${selector}`, {
        '@media': {
            "screen and (max-width: 800px)": rule
        }
    })
}

media(` button.${icon}`, {
    backgroundColor: "transparent",
    color: "white",
    fontSize: "1.8em",
    //float: "left",
    display: "block",
})

media(` > .${menu}`, {
    display: "none",
})

media(`:hover > .${menu}`, {
    textAlign: "left",
    display: "block",
    float: "none",
})

globalStyle(`${topnav}.${absolute}`, {
    position: "absolute"
});

globalStyle(`${topnav} a`, {
    float: "left",
    display: "block",
    color: "#f2f2f2",
    textAlign: "center",
    padding: "14px 16px",
    textDecoration: "none",
    fontSize: "17px",
})

/* Add an active class to highlight the current page */
export const active = style({
    backgroundColor: "#04AA6D",
    color: "white",
})

/* Hide the link that should open and close the topnav on small screens */
globalStyle(`${topnav} .${icon}`, {
    display: "none",
})

/* Dropdown container - needed to position the dropdown content */
export const dropdown = style({
    float: "left",
    //overflow: "hidden",
})

/* Style the dropdown button to fit inside the topnav */
globalStyle(`${dropdown} .${dropbtn}`, {
    fontSize: "17px",
    border: "none",
    outline: "none",
    color: "white",
    padding: "14px 16px",
    backgroundColor: "inherit",
    fontFamily: "inherit",
    margin: "0",
})

/* Style the dropdown content (hidden by default) */
export const dropdownContent = style({
    display: "none",
    position: "absolute",
    backgroundColor: "#f9f9f9",
    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    zIndex: "1",
})

/* Style the links inside the dropdown */
globalStyle(`${dropdownContent} a`, {
    float: "none",
    color: "black",
    padding: "12px 16px",
    textDecoration: "none",
    display: "block",
    textAlign: "left",
})

/* Add a dark background on topnav links and the dropdown button on hover */
globalStyle(`${topnav} a:hover, ${dropdown}:hover .${dropbtn}`, {
    backgroundColor: "#555",
    color: "white",
})

/* Add a grey background to dropdown links on hover */
globalStyle(`${dropdownContent} a:hover`, {
    backgroundColor: "#ddd",
    color: "black",
})

/* Show the dropdown menu when the user moves the mouse over the dropdown button */
globalStyle(`${dropdown}:hover ${dropdownContent}`, {
    display: "block",
})

const module = { topnav, absolute, active, dropdown, icon, menu, dropbtn, dropdownContent, }
export default module
