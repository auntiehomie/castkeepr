import { default as React, ReactNode } from 'react';
import { Theme } from '../enums';
import { INeynarAuthenticatedUser, IUser, SetState } from '../types/common';
import { ToastType } from '../components/atoms/Toast/ToastItem';
interface INeynarContext {
    client_id: string;
    theme: Theme;
    setTheme: SetState<Theme>;
    isAuthenticated: boolean;
    showToast: (type: ToastType, message: string) => void;
    user: INeynarAuthenticatedUser | null;
    logoutUser: () => void;
}
export interface NeynarContextProviderProps {
    children: ReactNode;
    settings: {
        clientId: string;
        defaultTheme?: Theme;
        eventsCallbacks?: {
            onAuthSuccess?: (params: {
                user: INeynarAuthenticatedUser;
            }) => void;
            onSignout?: (user: IUser | undefined) => void;
        };
    };
}
export declare const NeynarContextProvider: React.FC<NeynarContextProviderProps>;
export declare const useNeynarContext: () => INeynarContext;
export {};
