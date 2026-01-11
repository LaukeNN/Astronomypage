
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
    const [recoverySession, setRecoverySession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Escuchamos el cambio de estado con el patrón de "espera activa"
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Evento detectado:", event);

            if (event === "PASSWORD_RECOVERY") {
                // Damos un respiro de 500ms para que las cookies de Vercel se asienten
                setTimeout(() => {
                    console.log("Sesión lista para actualizar (Active Wait confirmed)");
                    setRecoverySession(session);
                    setInitializing(false);
                }, 500);
            } else if (event === "SIGNED_IN") {
                // Fallback para ciertos flujos donde SIGNED_IN ocurre antes
                const isRecovery = window.location.hash.includes('type=recovery');
                if (isRecovery) {
                    setTimeout(() => {
                        console.log("Sesión recuperada vía SIGNED_IN");
                        setRecoverySession(session);
                        setInitializing(false);
                    }, 500);
                }
            } else if (event === "USER_UPDATED") {
                console.log("¡Contraseña actualizada con éxito! (Event Detected)");
                setSuccess(true);
                // Redirección automática tras breve pausa visual
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            }
        });

        // Timeout de seguridad si no ocurre nada en 10s
        const safetyTimeout = setTimeout(() => {
            if (initializing) {
                console.warn("No auth event detected in 10s");
                setInitializing(false);
                // No seteamos error fatal aun, la UI mostrará que no hay sesión
            }
        }, 10000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (password !== confirmPassword) {
                throw new Error("Las contraseñas no coinciden.");
            }

            if (password.length < 6) {
                throw new Error("La contraseña debe tener al menos 6 caracteres.");
            }

            // REPARACIÓN CLAVE: Verificamos sesión manualmente antes de disparar
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("La sesión de recuperación expiró o es inválida. Por favor, solicita un nuevo correo.");
            }

            console.log("Updating password...");
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            console.log("✅ Contraseña actualizada");
            setSuccess(true);

            // Clean up and redirect
            setTimeout(async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
            }, 3000);

        } catch (err) {
            console.error("Password update failed:", err);
            setError(err.message || "Error al cambiar contraseña.");
        } finally {
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
