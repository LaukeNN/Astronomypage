
import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Inicio', href: '/#hero' }, // Use absolute paths or HashLink if preferred, simpler for now
        { name: 'Noticias', href: '/#news' },
        { name: 'Eventos', href: '/#events' },
        { name: 'Galería', href: '/#gallery' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-deep-space-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-2xl font-bold text-white hover:opacity-80 transition-opacity"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setMobileMenuOpen(false);
                    }}
                >
                    <Rocket className="text-starlight-gold animate-pulse" />
                    <span className="tracking-wider">CIELO<span className="text-starlight-gold">ABIERTO</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="text-gray-300 hover:text-electric-cyan transition-colors text-sm uppercase tracking-widest">
                            {link.name}
                        </a>
                    ))}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-electric-cyan text-sm flex items-center gap-1">
                                <User size={16} /> Hola, {user.full_name || user.email?.split('@')[0]}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="px-3 py-1 border-red-500/50 text-red-400 hover:bg-red-500/10">
                                <LogOut size={16} />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="text-white hover:text-electric-cyan">Entrar</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm" className="px-4 py-2 text-sm shadow-[0_0_15px_rgba(34,211,238,0.3)]">Registrarse</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-deep-space-black border-t border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-300 hover:text-electric-cyan py-2 block"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}

                            {user ? (
                                <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                                    <span className="text-electric-cyan text-sm">Hola, {user.full_name || user.email}</span>
                                    <Button variant="outline" onClick={handleLogout} className="w-full justify-center border-red-500 text-red-400">Cerrar Sesión</Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-center">Entrar</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="primary" className="w-full justify-center">Registrarse</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
