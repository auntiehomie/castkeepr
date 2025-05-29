export type ProfileCardProps = {
    fid?: number;
    username: string;
    displayName: string;
    avatarImgUrl: string;
    bio: string;
    followers: number;
    following: number;
    hasPowerBadge: boolean;
    isFollowing?: boolean;
    isOwnProfile?: boolean;
    onCast?: () => void;
    containerStyles?: React.CSSProperties;
};
export declare const ProfileCard: import('react').MemoExoticComponent<({ fid, username, displayName, avatarImgUrl, bio, followers, following, hasPowerBadge, isFollowing, isOwnProfile, onCast, containerStyles, }: ProfileCardProps) => import("react/jsx-runtime").JSX.Element>;
