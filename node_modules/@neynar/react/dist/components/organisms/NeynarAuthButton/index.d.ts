import { default as React } from 'react';
import { SIWN_variant } from '../../../enums';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    icon?: React.ReactNode;
    variant?: SIWN_variant;
    customLogoUrl?: string;
    modalStyle?: React.CSSProperties;
    modalButtonStyle?: React.CSSProperties;
}
export declare const NeynarAuthButton: React.FC<ButtonProps>;
export {};
