import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';

interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    age?: number;
    gender?: string;
    state?: string;
    district?: string;
    category?: string;
    annualIncome?: number;
    occupation?: string;
    education?: string;
    profileCompletion?: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('sabal_setu_token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            refreshUser().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data.user);
        } catch {
            logout();
        }
    };

    const login = async (email: string, password: string) => {
        const response = await authAPI.login({ email, password });
        const { user: userData, token: newToken } = response.data;
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('sabal_setu_token', newToken);
        localStorage.setItem('sabal_setu_user', JSON.stringify(userData));
    };

    const register = async (email: string, password: string, fullName: string, phone?: string) => {
        const response = await authAPI.register({ email, password, fullName, phone });
        const { user: userData, token: newToken } = response.data;
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('sabal_setu_token', newToken);
        localStorage.setItem('sabal_setu_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('sabal_setu_token');
        localStorage.removeItem('sabal_setu_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user && !!token,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
