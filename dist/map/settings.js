import React from "react";
import css from "./settings.css";
import { useState } from "react";
import { useRouter } from "next/router";
import A from "../a";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
export const SettingsGear = ({ icons, show, className, children }) => {
    const router = useRouter();
    const basePath = router.basePath;
    const [fallbackShowSettings, setFallbackShowSettings] = useState(false);
    const [showSettings, setShowSettings] = show || [fallbackShowSettings, setFallbackShowSettings];
    const [hoverSettings, setHoverSettings] = useState(false);
    return (React.createElement("div", { className: className ? `${css.container} ${className}` : css.container, onMouseEnter: () => setHoverSettings(true), onMouseLeave: () => setHoverSettings(false) },
        React.createElement("div", { className: css.settings },
            React.createElement(FontAwesomeIcon, { className: css.gear, icon: faGear, onClick: () => {
                    console.log(`setShowSettings(${!showSettings})`);
                    setShowSettings(!showSettings);
                    if (showSettings) {
                        setHoverSettings(false);
                    }
                } }),
            (showSettings || hoverSettings) &&
                React.createElement("div", { className: css.menu },
                    children,
                    React.createElement("div", { className: css.icons }, icons?.map(({ src, alt, href, title, key, className }) => React.createElement(A, { key: key || src, href: href },
                        React.createElement("img", { alt: alt, className: className ? `${css.icon} ${className}` : css.icon, src: `${basePath}/${src}`, title: title || alt }))))))));
};
