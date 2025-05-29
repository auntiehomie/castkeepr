import { default as React } from 'react';
import { NeynarFrame } from '../organisms/NeynarFrameCard';
export type FrameCardProps = {
    frame: NeynarFrame | null;
    onFrameBtnPress: (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>, inputValue?: string) => Promise<void>;
};
export declare const FrameCard: React.FC<FrameCardProps>;
export default FrameCard;
