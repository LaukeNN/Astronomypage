import React from 'react';
import { Rocket, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-deep-space-black py-12 px-6 border-t border-white/5">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Rocket className="text-starlight-gold" size={24} />
                    <span>CIELO<span className="text-starlight-gold">ABIERTO</span></span>
                </div>

                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                </div>

                <p className="text-gray-600 text-sm">
                    © {new Date().getFullYear()} Cielo Abierto. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
