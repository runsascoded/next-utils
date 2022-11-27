import React, { useRef } from 'react';
import { ytContainer, ytVideo } from "./youtube.css";
export default function YouTubeEmbed({ video, alt, thumbnailQuality = 'hq720' }) {
    const divRef = useRef(null);
    const onClick = () => {
        console.log("click");
        const iframe = document.createElement("iframe");
        iframe.classList.add(ytVideo);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute("src", `https://www.youtube.com/embed/${video}?rel=0&showinfo=1&autoplay=1`);
        if (divRef.current) {
            divRef.current.innerHTML = "";
            divRef.current.appendChild(iframe);
        }
    };
    return (React.createElement("div", { ref: divRef, className: `${ytContainer} youtube-frame` },
        React.createElement("img", { className: `${ytVideo} shadow`, loading: "lazy", src: `https://img.youtube.com/vi/${video}/${thumbnailQuality}.jpg`, alt: alt }),
        React.createElement("span", { onClick: onClick })));
}
