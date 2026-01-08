import React from 'react';
import Button from './Button';

const Contact = () => {
    return (
        <section id="contact" className="py-20 px-6 bg-navy-blue/20">
            <div className="container mx-auto max-w-2xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Únete a la <span className="text-electric-cyan">Aventura</span></h2>
                <p className="text-gray-400 mb-10">¿Tienes preguntas sobre nuestras expediciones? Contáctanos.</p>

                <form className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Nombre</label>
                            <input type="text" className="w-full bg-deep-space-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-starlight-gold transition-colors" placeholder="Tu nombre" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input type="email" className="w-full bg-deep-space-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-starlight-gold transition-colors" placeholder="tucorreo@ejemplo.com" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Mensaje</label>
                        <textarea rows="4" className="w-full bg-deep-space-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-starlight-gold transition-colors" placeholder="¿Cómo podemos ayudarte?"></textarea>
                    </div>

                    <Button variant="primary" className="w-full md:w-auto px-12 mx-auto">Enviar Mensaje</Button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
