
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, Clock, MapPin, Radio } from 'lucide-react';
import Button from './Button';

const RealtimeEventCard = ({ title, date, location, time, description, image, sourceUrl }) => {
    const handleInteract = () => {
        const message = `Quiero saber más sobre el evento: ${title}. ${description}`;
        window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { message } }));
    };

    const handleImageClick = () => {
        if (sourceUrl) {
            window.open(sourceUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col border border-electric-cyan/30 bg-gradient-to-br from-deep-space-black to-navy-blue/40 rounded-2xl overflow-hidden relative"
        >
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/50 z-10">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-200 text-xs font-bold uppercase tracking-wider">En Vivo / Próximo</span>
            </div>

            <div
                className="h-40 overflow-hidden relative cursor-pointer group"
                onClick={handleImageClick}
                title={sourceUrl ? "Click para visitar la página oficial" : ""}
            >
                <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-space-black via-transparent to-transparent"></div>

                {/* Overlay with "Visit Source" indicator */}
                {sourceUrl && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-white font-bold text-sm">Visitar Fuente Oficial</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-electric-cyan mb-2 text-sm">
                    <Rocket size={16} />
                    <span>Evento Astronómico Global</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-400 text-xs mb-6">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {date.day} {date.month}</div>
                    <div className="flex items-center gap-1"><Clock size={14} /> {time}</div>
                    <div className="flex items-center gap-1"><MapPin size={14} /> {location}</div>
                </div>

                <div className="mt-auto flex gap-3 flex-col sm:flex-row">
                    {sourceUrl && (
                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-electric-cyan text-deep-space-black hover:bg-white flex-1 justify-center"
                            onClick={handleImageClick}
                        >
                            Ver Transmisión en Vivo
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-deep-space-black flex-1 justify-center"
                        onClick={handleInteract}
                    >
                        <Radio className="mr-2 w-3 h-3" />
                        AI Info
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default RealtimeEventCard;
