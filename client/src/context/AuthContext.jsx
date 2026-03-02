// client/src/context/AuthContext.jsx
// Isolated so Vite Fast Refresh doesn't complain about mixed exports

import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [landlord, setLandlord] = useState(() => {
        try { return JSON.parse(localStorage.getItem('rentdesk_user')); }
        catch { return null; }
    });

    const login = useCallback((token, user) => {
        localStorage.setItem('rentdesk_token', token);
        localStorage.setItem('rentdesk_user', JSON.stringify(user));
        setLandlord(user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('rentdesk_token');
        localStorage.removeItem('rentdesk_user');
        setLandlord(null);
    }, []);

    return (
        <AuthContext.Provider value={{ landlord, login, logout, isAuth: !!landlord }}>
            {children}
        </AuthContext.Provider>
    );
}
