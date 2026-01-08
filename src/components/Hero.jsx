import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import Button from './Button';

const Hero = () => {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-deep-space-black via-[#0f172a] to-deep-space-black z-0">
                <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-cyan/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-starlight-gold/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <Star className="w-4 h-4 text-starlight-gold fill-starlight-gold" />
                        <span className="text-sm text-gray-300 uppercase tracking-wider">Próxima Expedición: 15 de Octubre</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Descubre los Secretos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-starlight-gold to-electric-cyan"> del Universo</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Únete a nuestras expediciones astronómicas guiadas. Observa cometas, planetas y la Vía Láctea con telescopios profesionales en lugares libres de contaminación lumínica.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Button variant="primary" onClick={() => scrollToSection('events')}>Próximo Avistamiento</Button>
                        <Button variant="outline" onClick={() => scrollToSection('gallery')}>Ver Galería</Button>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500 cursor-pointer"
                onClick={() => scrollToSection('news')}
            >
                <ChevronDown />
            </motion.div>
        </section>
    );
};

export default Hero;
