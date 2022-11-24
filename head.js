import { default as NextHead } from "next/head";
import React from "react";
import getConfig from 'next/config';
export function Head({ title, description, type = 'website', url, thumbnail, favicon, twitterCard = 'summary_large_image', children, }) {
    const { publicRuntimeConfig: config } = getConfig();
    const { basePath = "" } = config;
    favicon = favicon || `${basePath}/favicon.ico`;
    return (React.createElement(NextHead, null,
        React.createElement("title", null, title),
        React.createElement("link", { rel: "icon", href: favicon }),
        React.createElement("meta", { name: "description", content: description }),
        React.createElement("meta", { property: "og:title", content: title }),
        React.createElement("meta", { property: "og:description", content: description }),
        React.createElement("meta", { property: "og:type", content: type }),
        React.createElement("meta", { property: "og:url", content: url }),
        React.createElement("meta", { property: "og:image", content: thumbnail }),
        React.createElement("meta", { name: "twitter:title", content: title }),
        React.createElement("meta", { name: "twitter:description", content: description }),
        React.createElement("meta", { name: "twitter:image", content: thumbnail }),
        React.createElement("meta", { name: "twitter:card", content: twitterCard }),
        children));
}
