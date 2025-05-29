import { default as React } from 'react';
interface User {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
}
interface UserDropdownProps {
    users: User[];
    onSelect: (user: User) => void;
    customStyles?: {
        dropdown?: React.CSSProperties;
        listItem?: React.CSSProperties;
        avatar?: React.CSSProperties;
        userInfo?: React.CSSProperties;
    };
}
declare const UserDropdown: React.FC<UserDropdownProps>;
export default UserDropdown;
