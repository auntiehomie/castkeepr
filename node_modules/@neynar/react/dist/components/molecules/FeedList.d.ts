import { default as React } from 'react';
import { CastCardProps } from './CastCard';
export type FeedListProps = {
    casts: CastCardProps[];
    cursor: string;
};
export declare const FeedList: React.MemoExoticComponent<({ casts, cursor }: FeedListProps) => import("react/jsx-runtime").JSX.Element>;
