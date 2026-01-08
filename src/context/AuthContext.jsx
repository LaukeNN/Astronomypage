
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { db } from '../lib/db';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const initSession = async () => {
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);

                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    setUser(session?.user ?? null);
                });
                return () => subscription.unsubscribe();
            } else {
                // Check local storage for mock session
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
            setLoading(false);
        };
        initSession();
    }, []);

    const login = async (email, password) => {
        if (supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.user;
        } else {
            const mockUser = await db.loginMock(email, password);
            setUser(mockUser);
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            return mockUser;
        }
    };

    const register = async (email, password, name) => {
        if (supabase) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            });
            if (error) throw error;
            return data.user;
        } else {
            const mockUser = await db.registerMock(email, password, name);
            setUser(mockUser);
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            return mockUser;
        }
    };

    const logout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        } else {
            localStorage.removeItem('currentUser');
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
