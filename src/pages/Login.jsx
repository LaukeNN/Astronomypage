
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Stars, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const Login = () => {
    const [view, setView] = useState('login'); // 'login' | 'forgot-password'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await resetPassword(email);
            setMessage('Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.');
            setTimeout(() => setView('login'), 5000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-deep-space-black z-[-1]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-blue/40 via-deep-space-black to-deep-space-black z-[-1]"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl">

                {view === 'login' ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-starlight-gold/20 rounded-full mb-4">
                                <Stars className="w-8 h-8 text-starlight-gold" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
                            <p className="text-gray-400">Accede a tu cuenta para reservar expediciones</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-6 text-sm text-center">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
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
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot-password')}
                                        className="text-xs text-gray-400 hover:text-electric-cyan transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </div>

                            <Button variant="primary" className="w-full justify-center py-4" disabled={loading}>
                                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        <p className="text-center mt-6 text-gray-400 text-sm">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="text-electric-cyan hover:underline hover:text-white transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <button onClick={() => setView('login')} className="absolute top-8 left-8 text-gray-400 hover:text-white">
                                <ArrowLeft size={24} />
                            </button>
                            <div className="inline-block p-3 bg-electric-cyan/20 rounded-full mb-4">
                                <Lock className="w-8 h-8 text-electric-cyan" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Recuperar Contraseña</h2>
                            <p className="text-gray-400 text-sm">Ingresa tu correo para recibir un enlace de recuperación.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-6 text-sm text-center">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-6">
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
                                    />
                                </div>
                            </div>

                            <Button variant="primary" className="w-full justify-center py-4" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar Enlace'}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
