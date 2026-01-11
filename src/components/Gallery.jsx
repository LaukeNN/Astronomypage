import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { db } from '../lib/db';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await db.getGallery();
                setPhotos(data);
            } catch (error) {
                console.error("Error fetching gallery:", error);
            }
        };
        fetchGallery();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    if (photos.length === 0) return null;

    const currentPhoto = photos[currentIndex];

    return (
        <section id="gallery" className="py-20 px-6 bg-deep-space-black relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Galería <span className="text-starlight-gold">del Cosmos</span></h2>
                    <p className="text-gray-400">Un viaje visual a través de las maravillas del universo en alta definición.</p>
                </div>

                {/* Main Carousel Stage */}
                <div
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-black cursor-pointer"
                    onClick={() => setIsZoomed(true)}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={currentPhoto.src || currentPhoto.image}
                            alt={currentPhoto.alt}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-space-black via-transparent to-transparent opacity-80"></div>

                    {/* Controls */}
                    <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors z-20 group-hover:opacity-100 opacity-0 duration-300">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors z-20 group-hover:opacity-100 opacity-0 duration-300">
                        <ChevronRight size={24} />
                    </button>

                    {/* Zoom Trigger */}
                    <button
                        onClick={() => setIsZoomed(true)}
                        className="absolute top-4 right-4 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-starlight-gold hover:bg-starlight-gold hover:text-deep-space-black transition-all z-20"
                        title="Ver en Pantalla Completa"
                    >
                        <Maximize2 size={20} />
                    </button>

                    {/* Info Capsule */}
                    <div className="absolute bottom-8 left-8 md:left-12 z-20 max-w-xl">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 transform translate-y-4 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
                            <h3 className="text-2xl font-bold text-white mb-2">{currentPhoto.alt || "Objeto Astronómico"}</h3>
                            <p className="text-electric-cyan text-sm tracking-widest uppercase">Imagen {currentIndex + 1} de {photos.length}</p>
                        </div>
                    </div>
                </div>

                {/* Thumbnails Strip */}
                <div className="flex justify-center mt-12 gap-4 overflow-x-auto py-6 px-4 scrollbar-hide">
                    {photos.map((photo, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ring-offset-2 ring-offset-deep-space-black ${currentIndex === index ? 'ring-2 ring-electric-cyan scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                        >
                            <img src={photo.src || photo.image} alt={photo.alt} className="w-full h-full object-cover bg-black" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox / Zoom Modal */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
                        onClick={() => setIsZoomed(false)}
                    >
                        <div className="absolute top-6 right-6 flex gap-4">
                            <a
                                href={currentPhoto.src || currentPhoto.image}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                                <ZoomIn size={24} />
                            </a>
                            <button
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-red-500/80 transition-colors"
                                onClick={() => setIsZoomed(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={currentPhoto.src || currentPhoto.image}
                            alt={currentPhoto.alt}
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm will-change-transform"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="absolute bottom-8 text-center">
                            <p className="text-white text-xl font-medium tracking-wide">{currentPhoto.alt}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default Gallery;
