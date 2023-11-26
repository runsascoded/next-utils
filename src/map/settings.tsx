import React from "react";
import css from "./settings.css";
import {Dispatch, ReactNode, useState} from "react";
import {useRouter} from "next/router";
import A from "../a";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

export type Icon = {
    src: string
    alt: string
    href: string
    key?: string
    title?: string
    className?: string
}

export type Props = {
    icons?: Icon[]
    show?: [ boolean, Dispatch<boolean> ]
    className?: string
    children?: ReactNode
}

export const SettingsGear = ({ icons, show, className, children }: Props) => {
    const router = useRouter()
    const basePath = router.basePath
    const [ fallbackShowSettings, setFallbackShowSettings ] = useState(false)
    const [ showSettings, setShowSettings ] = show || [ fallbackShowSettings, setFallbackShowSettings ]
    const [ hoverSettings, setHoverSettings ] = useState(false)
    return (
        <div className={className ? `${css.container} ${className}` : css.container} onMouseEnter={() => setHoverSettings(true)} onMouseLeave={() => setHoverSettings(false)}>
            <div className={css.settings}>
                <FontAwesomeIcon className={css.gear} icon={faGear} onClick={() => {
                    console.log(`setShowSettings(${!showSettings})`)
                    setShowSettings(!showSettings)
                    if (showSettings) {
                        setHoverSettings(false)
                    }
                }} />
                {
                    (showSettings || hoverSettings) &&
                    <div className={css.menu}>
                        {children}
                        <div className={css.icons}>{
                            icons?.map(
                                ({ src, alt, href, title, key, className }) =>
                                    <A key={key || src} href={href}>
                                        <img
                                            alt={alt}
                                            className={className ? `${css.icon} ${className}` : css.icon}
                                            src={`${basePath}/${src}`}
                                            title={title || alt}
                                        />
                                    </A>)
                        }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
