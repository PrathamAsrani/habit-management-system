import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        try {
            const data = localStorage.getItem("auth");
            return data ? JSON.parse(data) : { user_id: null, pages: 0 };
        }
        catch (err) {
            console.error('Error parsing auth data from localStorage:', err.message);
            // Return a default value in case of an error
            return { user_id: null, pages: 0 };
        }
    });

    useEffect(() => {
        try{
            localStorage.setItem('auth', JSON.stringify(auth));
        }
        catch(err){
            console.error('Error saving auth data to localStorage:', err.message);
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };