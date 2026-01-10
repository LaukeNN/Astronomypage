
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: Check if we have a session (established via the magic link redirect)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, they might have arrived here incorrectly or link expired
                setError("Enlace inválido o expirado. Por favor solicita un nuevo correo de recuperación.");
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) throw error;

            setMessage("¡Contraseña actualizada con éxito! Redirigiendo al inicio de sesión...");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-deep-space-black z-[-1]"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-deep-space-black to-deep-space-black z-[-1]"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl">

                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-electric-cyan/20 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-electric-cyan" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Restablecer Contraseña</h2>
                    <p className="text-gray-400 text-sm">Ingresa tu nueva contraseña a continuación.</p>
                </div>

                {message && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <CheckCircle size={18} />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Nueva Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Confirmar Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button variant="primary" className="w-full justify-center py-3" disabled={loading}>
                        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
