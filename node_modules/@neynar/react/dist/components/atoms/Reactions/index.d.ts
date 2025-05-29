import { default as React } from 'react';
type ReactionsProps = {
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
    onComment?: () => void;
    onRecast?: () => boolean;
    onLike?: () => boolean;
    isLiked: boolean;
};
declare const Reactions: React.FC<ReactionsProps>;
export default Reactions;
