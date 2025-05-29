import { default as React, ReactNode } from 'react';
import { INeynarAuthenticatedUser, IUser, SetState } from '../types/common';
interface IAuthContext {
    isAuthenticated: boolean;
    setIsAuthenticated: SetState<boolean>;
    user: INeynarAuthenticatedUser | null;
    setUser: SetState<INeynarAuthenticatedUser | null>;
    onAuthSuccess: (params: {
        user: INeynarAuthenticatedUser;
    }) => void;
    onSignout: (user: IUser | undefined) => void;
}
export interface AuthContextProviderProps {
    children: ReactNode;
    _setIsAuthenticated: (_isAuthenticated: boolean) => void;
    _setUser: (_user: INeynarAuthenticatedUser | null) => void;
    _onAuthSuccess?: (params: {
        user: INeynarAuthenticatedUser;
    }) => void;
    _onSignout?: (user: IUser | undefined) => void;
}
export declare const AuthContextProvider: React.FC<AuthContextProviderProps>;
export declare const useAuth: () => IAuthContext;
export {};
