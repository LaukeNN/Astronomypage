
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { db } from '../lib/db';

const TIMEOUT_MS = 10000; // 10 seconds timeout

const withTimeout = (promise) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('La conexión tardó demasiado. Por favor, intenta de nuevo.')), TIMEOUT_MS)
        )
    ]);
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const initSession = async () => {
            try {
                if (supabase) {
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError) throw sessionError;

                    if (session?.user) {
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();

                        if (profileError && profileError.code !== 'PGRST116') {
                            console.warn("Profile fetch error:", profileError);
                        }

                        setUser({ ...session.user, role: profile?.role || 'user' });
                    } else {
                        setUser(null);
                    }

                    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                        if (session?.user) {
                            const { data: profile } = await supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', session.user.id)
                                .single();
                            setUser({ ...session.user, role: profile?.role || 'user' });
                        } else {
                            setUser(null);
                        }
                    });
                    return () => subscription.unsubscribe();
                } else {
                    // Check local storage for mock session
                    const storedUser = localStorage.getItem('currentUser');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            } catch (error) {
                console.error("Auth init error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initSession();
    }, []);

    const login = async (email, password) => {
        if (supabase) {
            const { data, error } = await withTimeout(supabase.auth.signInWithPassword({ email, password })); if (error) throw error;
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
            const { data, error } = await withTimeout(supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                    emailRedirectTo: `${window.location.origin}/email-verified`
                }
            }));
            if (error) throw error;
            return data.user;
        } else {
            const mockUser = await db.registerMock(email, password, name);
            setUser(mockUser);
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            return mockUser;
        }
    };

    const resetPassword = async (email) => {
        if (supabase) {
            const { error } = await withTimeout(supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            }));
            if (error) throw error;
            return true;
        } else {
            // Mock behavior
            await new Promise(resolve => setTimeout(resolve, 800));
            return true;
        }
    };

    const logout = async () => {
        if (supabase) {
            try {
                await withTimeout(supabase.auth.signOut());
            } catch (error) {
                console.warn("Logout timeout or error, forcing local cleanup:", error);
            }
        } else {
            localStorage.removeItem('currentUser');
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, resetPassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
