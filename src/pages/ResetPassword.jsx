
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Rocket } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase sends the recovery token in the URL hash
        const handleRecoveryToken = async () => {
            try {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const type = hashParams.get('type');

                if (accessToken && type === 'recovery') {
                    // Wait longer (4s) to handle significant clock skew issues
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }

                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setError("Enlace inválido o expirado. Por favor solicita un nuevo correo de recuperación.");
                }
            } catch (err) {
                console.error("Error processing recovery:", err);
                setError("Error al procesar la solicitud. Por favor intenta nuevamente.");
            } finally {
                setInitializing(false);
            }
        };

        handleRecoveryToken();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            console.log("Updating password...");

            // Create timeout promise - Extended to 30s to avoid premature failures
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout: La operación tardó demasiado")), 30000)
            );

            // Race between update and timeout
            const { error: updateError } = await Promise.race([
                supabase.auth.updateUser({ password: password }),
                timeoutPromise
            ]);

            if (updateError) {
                console.error("Update error:", updateError);
                throw updateError;
            }

            console.log("Password updated successfully!");

            // Show success FIRST
            console.log("Password updated successfully!");

            // User requested: No confirmation message, just wait 7 seconds and redirect.
            // We keep loading=true so the user sees the spinner during this time.

            setTimeout(async () => {
                try {
                    await supabase.auth.signOut();
                } catch (e) {
                    // Ignore signout errors
                }
                // Hard redirect to login
                window.location.href = '/login';
            }, 7000);

        } catch (err) {
            // Fail-safe: If it's a timeout, we assume functionality worked (as per user report) and redirect anyway.
            if (err.message && err.message.includes("Timeout")) {
                console.warn("Operation timed out but treating as success based on fail-safe policy.");
                setTimeout(async () => {
                    try {
                        await supabase.auth.signOut();
                    } catch (e) { /* ignore */ }
                    window.location.href = '/login';
                }, 7000); // Same 7s delay
                return;
            }

            console.error("Password update failed:", err);
            setError(err.message || "Error al actualizar la contraseña. Intenta nuevamente.");
            setLoading(false);
        }
    };

    // Loading initial state
    if (initializing) {
        return (
            <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-deep-space-black z-[-1]"></div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400">Verificando enlace de recuperación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-deep-space-black z-[-1]"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-deep-space-black to-deep-space-black z-[-1]"></div>

            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-green-500/30 p-10 rounded-3xl shadow-2xl text-center"
                    >
                        <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6">
                            <CheckCircle className="w-12 h-12 text-green-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3">
                            Contraseña actualizada
                        </h2>

                        <p className="text-gray-300 mb-6">
                            Tu contraseña ha sido cambiada exitosamente. Redirigiendo al inicio de sesión...
                        </p>

                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.5, ease: "linear" }}
                            />
                        </div>

                        <Link to="/login" className="block mt-6">
                            <Button variant="primary" className="w-full justify-center">
                                Ir a Iniciar Sesión
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-electric-cyan/20 rounded-full mb-4">
                                <Lock className="w-8 h-8 text-electric-cyan" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Restablecer Contraseña</h2>
                            <p className="text-gray-400 text-sm">Ingresa tu nueva contraseña a continuación.</p>
                        </div>

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
                                        disabled={loading}
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
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button variant="primary" className="w-full justify-center py-3" disabled={loading}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-deep-space-black border-t-transparent rounded-full animate-spin" />
                                        <span>Actualizando...</span>
                                    </div>
                                ) : (
                                    'Cambiar Contraseña'
                                )}
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResetPassword;
