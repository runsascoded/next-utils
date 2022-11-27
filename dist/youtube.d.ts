/// <reference types="react" />
export type Props = {
    video: string;
    alt: string;
    thumbnailQuality?: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'hq720';
};
export default function YouTubeEmbed({ video, alt, thumbnailQuality }: Props): JSX.Element;
