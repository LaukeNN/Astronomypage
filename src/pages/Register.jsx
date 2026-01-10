
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Rocket, Stars, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(email, password, name);
            setSuccess(true);
            // Redirect after showing success message
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-deep-space-black z-[-1]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-starlight-gold/10 via-deep-space-black to-deep-space-black z-[-1]"></div>

            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-electric-cyan/30 p-10 rounded-3xl shadow-2xl text-center"
                    >
                        <div className="inline-block p-4 bg-electric-cyan/20 rounded-full mb-6 relative">
                            <Rocket className="w-12 h-12 text-electric-cyan animate-bounce" />
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">
                            ¡Bienvenido a Bordo,<br />
                            <span className="text-electric-cyan">{name.split(' ')[0]}!</span>
                        </h2>

                        <p className="text-gray-300 mb-6 text-lg">
                            Tu cuenta ha sido creada exitosamente. Revisa tu email para verificar tu cuenta y comenzar la aventura espacial.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-starlight-gold">
                            <Stars className="w-5 h-5" />
                            <span className="text-sm">Preparando tu viaje al cosmos...</span>
                            <Stars className="w-5 h-5" />
                        </div>

                        <div className="mt-6">
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-electric-cyan"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                />
                            </div>
                        </div>
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
                                <Rocket className="w-8 h-8 text-electric-cyan" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Únete a la Tripulación</h2>
                            <p className="text-gray-400">Crea tu cuenta para comenzar la aventura</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                                        placeholder="Juan Pérez"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                                        placeholder="ejemplo@correo.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Contraseña</label>
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

                            <Button variant="primary" className="w-full justify-center py-4" disabled={loading}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-deep-space-black border-t-transparent rounded-full animate-spin" />
                                        <span>Creando cuenta...</span>
                                    </div>
                                ) : (
                                    'Registrarse'
                                )}
                            </Button>
                        </form>

                        <p className="text-center mt-6 text-gray-400 text-sm">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="text-electric-cyan hover:underline hover:text-white transition-colors">
                                Inicia sesión
                            </Link>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Register;
