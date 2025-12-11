import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, removeToken, login as apiLogin, register as apiRegister } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
    const [loading, setLoading] = useState(false);
    
    const login = async (email, password) => {
        setLoading(true);
        try {
            await apiLogin(email, password);
            setIsAuthenticated(true);
        } catch (error) {
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    const value = { 
        isAuthenticated, 
        loading, 
        login, 
        logout, 
        register: apiRegister
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;