import { createContext, useState, useEffect } from 'react';
import { getToken, removeToken, login as apiLogin, register as apiRegister } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);
    
    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        setIsAuthenticated(true);
        return data;
    };

    const logout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, register: apiRegister }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;