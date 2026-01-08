import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, X, Check, User, Rocket, Radio } from 'lucide-react';
import Button from './Button';
import { db } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PayPalButtonComponent from './PayPalButton';
import { motion, AnimatePresence } from 'framer-motion';

const EventCard = ({ id, title, date, location, time, slots, price, onReserve }) => (
    <div className="flex flex-col md:flex-row items-center border border-white/10 bg-white/5 rounded-2xl p-6 gap-6 hover:bg-white/10 transition-colors">
        <div className="flex-shrink-0 bg-navy-blue p-4 rounded-xl text-center min-w-[100px]">
            <span className="block text-electric-cyan font-bold text-xl">{date.day}</span>
            <span className="block text-gray-400 text-sm uppercase">{date.month}</span>
        </div>

        <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <div className="flex flex-col md:flex-row gap-4 text-gray-400 text-sm justify-center md:justify-start">
                <div className="flex items-center gap-1"><MapPin size={16} /> {location}</div>
                <div className="flex items-center gap-1"><Clock size={16} /> {time}</div>
            </div>
            <div className="mt-2 text-starlight-gold font-bold">
                ${price} USD
            </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <Button
                variant="primary"
                className="w-full md:w-auto"
                onClick={() => onReserve(id)}
                disabled={slots <= 0}
            >
                {slots > 0 ? 'Reservar Lugar' : 'Agotado'}
            </Button>
            <span className={`text-xs ${slots > 0 ? 'text-starlight-gold' : 'text-red-400'}`}>
                {slots} lugares disponibles
            </span>
        </div>
    </div>
);

const RealtimeEventCard = ({ title, date, location, time, description, image }) => {
    const handleInteract = () => {
        const message = `Quiero saber más sobre el evento: ${title}. ${description}`;
        window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { message } }));
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col md:flex-row border border-electric-cyan/30 bg-gradient-to-r from-deep-space-black to-navy-blue/40 rounded-2xl overflow-hidden relative"
        >
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/50">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-200 text-xs font-bold uppercase tracking-wider">En Vivo / Próximo</span>
            </div>

            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-space-black via-transparent to-transparent md:bg-gradient-to-r"></div>
            </div>

            <div className="p-6 md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-electric-cyan mb-2 text-sm">
                    <Rocket size={16} />
                    <span>Evento Astronómico Global</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{description}</p>

                <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-6">
                    <div className="flex items-center gap-1"><Calendar size={16} /> {date.day} {date.month}</div>
                    <div className="flex items-center gap-1"><Clock size={16} /> {time}</div>
                    <div className="flex items-center gap-1"><MapPin size={16} /> {location}</div>
                </div>

                <Button
                    variant="outline"
                    className="self-start border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-deep-space-black"
                    onClick={handleInteract}
                >
                    <Radio className="mr-2 w-4 h-4" />
                    Interactuar con AI
                </Button>
            </div>
        </motion.div>
    );
};

const Events = () => {
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' (booking) or 'realtime'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        const data = await db.getEvents();
        setEvents(data);
    };

    const handleReserve = (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        const event = events.find(e => e.id === eventId);
        setSelectedEvent(event);
        setShowModal(true);
        setPaymentSuccess(false);
        setError('');
    };

    const handlePaymentSuccess = async (details) => {
        try {
            await db.registerForEvent(user.id || user.email, selectedEvent.id);
            setPaymentSuccess(true);
            loadEvents();
            setTimeout(() => {
                setShowModal(false);
                setSelectedEvent(null);
            }, 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredEvents = events.filter(e => {
        if (activeTab === 'upcoming') return e.type === 'booking' || !e.type; // Default to booking if no type
        if (activeTab === 'realtime') return e.type === 'realtime';
        return true;
    });

    return (
        <section id="events" className="py-20 px-6 bg-gradient-to-b from-transparent to-navy-blue/30 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Calendario de <span className="text-electric-cyan">Eventos</span></h2>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/10">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'bg-electric-cyan text-deep-space-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Expediciones y Charlas
                        </button>
                        <button
                            onClick={() => setActiveTab('realtime')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'realtime' ? 'bg-electric-cyan text-deep-space-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Fenómenos en Vivo
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredEvents.map((event) => (
                        activeTab === 'upcoming' ? (
                            <EventCard
                                key={event.id}
                                {...event}
                                onReserve={handleReserve}
                            />
                        ) : (
                            <RealtimeEventCard
                                key={event.id}
                                {...event}
                            />
                        )
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="text-center text-gray-400 py-10">
                            No hay eventos en esta categoría por el momento.
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showModal && selectedEvent && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !paymentSuccess && setShowModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-deep-space-black border border-white/10 p-8 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                disabled={paymentSuccess}
                            >
                                <X />
                            </button>

                            {!paymentSuccess ? (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-4">Confirmar Reserva</h3>

                                    <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                            <span className="text-gray-300">Evento:</span>
                                            <span className="text-electric-cyan font-bold text-right">{selectedEvent.title}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Fecha:</span>
                                            <span className="text-white text-sm">{selectedEvent.date.day} {selectedEvent.date.month}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-2">
                                            <span className="text-lg text-white">Total a pagar:</span>
                                            <span className="text-2xl text-starlight-gold font-bold">${selectedEvent.price} USD</span>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <p className="text-gray-400 text-xs text-center mb-4">Pago seguro procesado por PayPal</p>
                                        <div className="flex justify-center">
                                            <PayPalButtonComponent
                                                amount={selectedEvent.price.toString()}
                                                onSuccess={handlePaymentSuccess}
                                                onError={(err) => setError("Error en el pago. Intente nuevamente.")}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="bg-green-500/20 inline-flex p-4 rounded-full mb-4">
                                        <Check className="w-12 h-12 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">¡Reserva Exitosa!</h3>
                                    <p className="text-gray-300">Tu lugar ha sido confirmado. Te enviamos los detalles a tu correo.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};


export default Events;
