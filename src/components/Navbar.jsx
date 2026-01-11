
import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
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
        setLoggingOut(true);
        try {
            await logout();
            navigate('/');
        } finally {
            setLoggingOut(false);
        }
    };

    const navLinks = [
        { name: 'Inicio', href: '/#hero' }, // Use absolute paths or HashLink if preferred, simpler for now
        { name: 'Noticias', href: '/#news' },
        { name: 'Eventos', href: '/#events' },
        { name: 'Galería', href: '/#gallery' },
    ];

    return (
        <>
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
                    <div className="hidden md:flex items-center gap-6">
                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-electric-cyan transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-electric-cyan transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.429l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-electric-cyan transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                        </div>

                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="text-gray-300 hover:text-electric-cyan transition-colors text-sm uppercase tracking-widest">
                                {link.name}
                            </a>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-electric-cyan text-sm flex items-center gap-1">
                                    <User size={16} /> Hola, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                                {user.role === 'admin' && (
                                    <Link to="/admin">
                                        <Button variant="outline" size="sm" className="border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10">
                                            Panel Admin
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="outline" size="sm" onClick={handleLogout} disabled={loggingOut} className="px-3 py-1 border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50">
                                    {loggingOut ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <LogOut size={16} />}
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
                                        <span className="text-electric-cyan text-sm">Hola, {user.user_metadata?.full_name || user.email}</span>
                                        <Button variant="outline" onClick={handleLogout} disabled={loggingOut} className="w-full justify-center border-red-500 text-red-400 disabled:opacity-50">
                                            {loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                                        </Button>
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
        </>
    );
};

export default Navbar;
