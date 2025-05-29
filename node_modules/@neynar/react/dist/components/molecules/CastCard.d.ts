import { default as React } from 'react';
import { NeynarFrame } from '../organisms/NeynarFrameCard';
export type CastCardProps = {
    username: string;
    displayName: string;
    avatarImgUrl: string;
    text: string;
    hash: string;
    reactions: {
        likes_count: number;
        recasts_count: number;
        likes: {
            fid: number;
            fname: string;
        }[];
        recasts: {
            fid: number;
            fname: string;
        }[];
    };
    replies: number;
    embeds: any[];
    frames: NeynarFrame[];
    channel?: {
        id: string;
        name: string;
        url: string;
    };
    viewerFid?: number;
    hasPowerBadge: boolean;
    isOwnProfile?: boolean;
    isEmbed?: boolean;
    allowReactions: boolean;
    renderEmbeds: boolean;
    renderFrames: boolean;
    onLikeBtnPress?: () => boolean;
    onRecastBtnPress?: () => boolean;
    onCommentBtnPress?: () => void;
    onFrameBtnPress?: (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>, inputValue?: string) => Promise<NeynarFrame>;
    direct_replies?: CastCardProps[];
    containerStyles?: React.CSSProperties;
    textStyles?: React.CSSProperties;
};
export declare const CastCard: React.MemoExoticComponent<({ username, displayName, avatarImgUrl, text, hash, reactions, replies, embeds, frames, channel, viewerFid, hasPowerBadge, isEmbed, allowReactions, renderEmbeds, renderFrames, onLikeBtnPress, onRecastBtnPress, onCommentBtnPress, onFrameBtnPress, direct_replies, containerStyles, textStyles }: CastCardProps) => import("react/jsx-runtime").JSX.Element>;
