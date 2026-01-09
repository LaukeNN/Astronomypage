import React, { useState, useEffect } from 'react';
import { MapPin, Clock, X, Check } from 'lucide-react';
import Button from './Button';
import { db } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentWindow from './PaymentWindow';
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

const Events = () => {
    const [events, setEvents] = useState([]);
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
        // Filter only for booking type
        setEvents(data.filter(e => e.type === 'booking' || !e.type));
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

    return (
        <section id="events" className="py-20 px-6 bg-gradient-to-b from-transparent to-navy-blue/30 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Calendario de <span className="text-electric-cyan">Expediciones</span></h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Únete a nuestras próximas salidas de campo y charlas astronómicas.</p>

                <div className="space-y-6">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            {...event}
                            onReserve={handleReserve}
                        />
                    ))}
                    {events.length === 0 && (
                        <div className="text-center text-gray-400 py-10">
                            No hay expediciones programadas por el momento.
                        </div>
                    )}
                </div>
            </div>



            {/* Payment Window for Events */}
            < PaymentWindow
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                amount={selectedEvent?.price}
                description={`Reserva para: ${selectedEvent?.title}`}
                title="Confirmar Reserva"
            />
        </section >
    );
};

export default Events;
