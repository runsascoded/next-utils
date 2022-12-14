import React, {ReactNode} from "react";
import {default as NextHead} from "next/head"
import {getBasePath} from "./basePath";

export type Head = {
    title: string
    description?: string
    type?: string
    url: string
    thumbnail: string
    favicon?: string
    twitterCard?: string
    children?: ReactNode
}
export function Head(
    {
        title,
        description,
        type = 'website',
        url,
        thumbnail,
        favicon,
        twitterCard = 'summary_large_image',
        children,
    }: Head
) {
    const basePath = getBasePath()
    favicon = favicon || `${basePath}/favicon.ico`
    return (
        <NextHead>
            <title>{title}</title>
            <link rel="icon" href={favicon} />
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={thumbnail} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={thumbnail} />
            <meta name="twitter:card" content={twitterCard} />
            {children}
        </NextHead>
    )
}
