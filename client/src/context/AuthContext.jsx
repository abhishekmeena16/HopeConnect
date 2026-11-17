// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify authentication status on initial page load / refresh
    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.warn("Stored session invalid or expired:", error.response?.data?.error || error.message);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = (userData, token) => {
        if (token) {
            localStorage.setItem('token', token);
        }
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignore error on logout
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const updateUser = (updatedUserData) => {
        setUser((prev) => ({
            ...prev,
            ...updatedUserData
        }));
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, updateUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;