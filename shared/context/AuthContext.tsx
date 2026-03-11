import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../../features/auth/auth.service';

interface AuthContextData {
    user: AuthResponse | null;
    isLoading: boolean;
    signIn: (data: AuthResponse) => Promise<void>;
    signOut: () => Promise<void>;
    token: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('@auth_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Failed to load auth', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredAuth();
    }, []);

    const signIn = async (userData: AuthResponse) => {
        setUser(userData);
        await AsyncStorage.setItem('@auth_user', JSON.stringify(userData));
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('@auth_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signIn,
                signOut,
                token: user?.token || null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
