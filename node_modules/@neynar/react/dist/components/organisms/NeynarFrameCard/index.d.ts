import { default as React } from 'react';
export type NeynarFrame = {
    version: string;
    title?: string;
    image: string;
    image_aspect_ratio?: string;
    buttons: {
        index: number;
        title: string;
        action_type: string;
        target?: string;
        post_url?: string;
    }[];
    input: {
        text?: string;
    };
    state: object;
    frames_url: string;
};
export type NeynarFrameCardProps = {
    url: string;
    onFrameBtnPress: (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>, inputValue?: string) => Promise<NeynarFrame>;
    initialFrame?: NeynarFrame;
};
export declare const NeynarFrameCard: React.FC<NeynarFrameCardProps>;
