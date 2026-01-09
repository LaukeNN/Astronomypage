import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Users } from 'lucide-react';
import { db } from '../lib/db';

const Contact = () => {
    const [team, setTeam] = useState([]);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [t, c] = await Promise.all([db.getTeam(), db.getConfig()]);
            setTeam(t);
            setConfig(c);
        };
        fetchData();
    }, []);

    const contact = config?.contact || { email: "Cargando...", phone: "Cargando...", address: "Cargando..." };

    return (
        <section id="contact" className="py-20 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-electric-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info Column */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Únete a la <span className="text-electric-cyan">Aventura</span></h2>
                        <p className="text-gray-400 mb-10 text-lg">
                            ¿Listo para explorar el cosmos? Contáctanos para reservar tu lugar o resolver tus dudas astronómicas.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-electric-cyan">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Correo Electrónico</h3>
                                    <a href={`mailto:${contact.email}`} className="text-gray-300 hover:text-electric-cyan transition-colors">
                                        {contact.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-starlight-gold">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Teléfono / WhatsApp</h3>
                                    <p className="text-gray-300">
                                        {contact.phone}
                                    </p>
                                    <p className="text-sm text-gray-500">(Lunes a Viernes 9hs - 18hs)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-purple-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Base de Operaciones</h3>
                                    <p className="text-gray-300">
                                        {contact.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Section Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Users className="text-starlight-gold" size={32} />
                            <h2 className="text-3xl font-bold text-white">Nuestro <span className="text-starlight-gold">Equipo</span></h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {team.map((member) => (
                                <motion.div
                                    key={member.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-navy-blue/40 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center backdrop-blur-sm"
                                >
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/10">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">{member.name}</h3>
                                    <p className="text-electric-cyan text-sm mb-2">{member.role}</p>
                                    {member.expertise && (
                                        <p className="text-gray-400 text-xs">{member.expertise}</p>
                                    )}
                                </motion.div>
                            ))}

                            {team.length === 0 && (
                                <p className="text-gray-500 italic">Cargando equipo...</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
