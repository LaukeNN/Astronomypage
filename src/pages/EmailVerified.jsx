
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, Rocket } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const EmailVerified = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect if already logged in (optional, but good UX if verification logs them in automatically)
    useEffect(() => {
        if (user) {
            // Maybe wait a few seconds so they see the success message
            const timer = setTimeout(() => {
                navigate('/login'); // Redirect to login, not home
            }, 3000); // 3 seconds
            return () => clearTimeout(timer);
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-deep-space-black z-[-1]"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/10 via-deep-space-black to-deep-space-black z-[-1]"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl text-center">
                <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6 animate-bounce">
                    <BadgeCheck className="w-12 h-12 text-green-400" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Mail confirmado, bienvenido a bordo</h2>
                <p className="text-gray-300 mb-8 text-lg">
                    Tu cuenta ha sido confirmada correctamente. Redirigiendo al inicio de sesión...
                </p>

                <div className="space-y-4">
                    <Link to="/login">
                        <Button variant="primary" className="w-full justify-center py-4 text-deep-space-black font-bold text-lg">
                            Iniciar Sesión
                        </Button>
                    </Link>

                    <Link to="/">
                        <Button variant="ghost" className="w-full justify-center">
                            Volver al Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmailVerified;
