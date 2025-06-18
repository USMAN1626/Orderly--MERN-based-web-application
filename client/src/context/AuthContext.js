
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id: '...', email: '...', type: 'customer' | 'restaurant' }
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null); // 'customer' or 'restaurant'

    // Check localStorage on initial load
    useEffect(() => {
        const customerId = localStorage.getItem('customerId');
        const customerEmail = localStorage.getItem('email');
        const restaurantId = localStorage.getItem('restaurantId');
        const restaurantName = localStorage.getItem('restaurantName');
        const restaurantEmail = localStorage.getItem('restaurantEmail');

        if (customerId && customerEmail) {
            setUser({ id: customerId, email: customerEmail, type: 'customer' });
            setIsAuthenticated(true);
            setUserType('customer');
        } else if (restaurantId && restaurantEmail) {
            setUser({ id: restaurantId, email: restaurantEmail, name: restaurantName, type: 'restaurant' });
            setIsAuthenticated(true);
            setUserType('restaurant');
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setUserType(null);
        }
    }, []); // Run once on component mount

    const login = (userData, type) => {


        localStorage.removeItem('customerId');
        localStorage.removeItem('email');
        localStorage.removeItem('restaurantId');
        localStorage.removeItem('restaurantName');
        localStorage.removeItem('restaurantEmail');
        localStorage.removeItem('restaurantLoggedIn');

        // Set new user data
        if (type === 'customer') {
            localStorage.setItem('customerId', userData.id);
            localStorage.setItem('email', userData.email);
        } else if (type === 'restaurant') {
            localStorage.setItem('restaurantId', userData.id);
            localStorage.setItem('restaurantName', userData.name);
            localStorage.setItem('restaurantEmail', userData.email);
            localStorage.setItem('restaurantLoggedIn', 'true');
        }

        setUser({ ...userData, type });
        setIsAuthenticated(true);
        setUserType(type);
    };

    const logout = (navigateTo = '/') => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        setUserType(null);

    };

    const value = {
        user,
        isAuthenticated,
        userType,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
