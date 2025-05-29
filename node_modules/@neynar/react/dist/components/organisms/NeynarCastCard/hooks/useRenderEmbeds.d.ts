import { default as React } from 'react';
interface Embed {
    url?: string;
    cast_id?: {
        fid: number;
        hash: string;
    };
}
declare const useRenderEmbeds: (embeds: Embed[], allowReactions: boolean, viewerFid?: number) => React.ReactNode[];
export { useRenderEmbeds };
