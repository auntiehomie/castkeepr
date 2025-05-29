import { default as React } from 'react';
type FeedType = 'url' | 'hash';
export type NeynarConversationListProps = {
    type: FeedType;
    identifier: string;
    replyDepth?: number;
    includeChronologicalParentCasts?: boolean;
    limit?: number;
    viewerFid?: number;
};
export declare const NeynarConversationList: React.FC<NeynarConversationListProps>;
export {};
