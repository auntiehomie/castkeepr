import { default as React } from 'react';
import { NeynarFrame } from '../NeynarFrameCard';
export type NeynarCastCardProps = {
    type: 'url' | 'hash';
    identifier: string;
    viewerFid?: number;
    allowReactions?: boolean;
    renderEmbeds?: boolean;
    renderFrames?: boolean;
    onLikeBtnPress?: () => boolean;
    onRecastBtnPress?: () => boolean;
    onCommentBtnPress?: () => void;
    onFrameBtnPress?: (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>, inputValue?: string) => Promise<NeynarFrame>;
    containerStyles?: React.CSSProperties;
    textStyles?: React.CSSProperties;
};
export declare const NeynarCastCard: React.FC<NeynarCastCardProps>;
