// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on initial load/refresh
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Assuming an endpoint /auth/me that returns current user based on HttpOnly cookie
                const response = await api.get('/auth/me'); 
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data);
        return response.data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);