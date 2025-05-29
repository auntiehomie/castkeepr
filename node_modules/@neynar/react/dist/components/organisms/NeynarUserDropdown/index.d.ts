import { default as React } from 'react';
export interface NeynarUserDropdownProps {
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
    placeholder?: string;
    disabled?: boolean;
    viewerFid?: number;
    customStyles?: {
        dropdown?: React.CSSProperties;
        listItem?: React.CSSProperties;
        avatar?: React.CSSProperties;
        userInfo?: React.CSSProperties;
    };
    limit?: number | null;
}
export declare const NeynarUserDropdown: React.FC<NeynarUserDropdownProps>;
export default NeynarUserDropdown;
