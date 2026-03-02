import React, { createContext, useContext, useState, useEffect } from 'react';

interface NgoUser { id: string; email: string; organization: string; }
interface AuthCtx { token: string | null; user: NgoUser | null; login: (email: string, password: string) => Promise<void>; logout: () => void; }

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('sabal_ngo_token'));
    const [user, setUser] = useState<NgoUser | null>(() => {
        const saved = localStorage.getItem('sabal_ngo_user');
        return saved ? JSON.parse(saved) : null;
    });

    async function login(email: string, password: string) {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://sabal-ngo-api.onrender.com/api';
        const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Login failed'); }
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('sabal_ngo_token', data.token);
        localStorage.setItem('sabal_ngo_user', JSON.stringify(data.user));
    }

    function logout() {
        setToken(null); setUser(null);
        localStorage.removeItem('sabal_ngo_token');
        localStorage.removeItem('sabal_ngo_user');
    }

    return <Ctx.Provider value={{ token, user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
