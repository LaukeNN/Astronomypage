import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const photos = [
        { src: "/images/nebulosa_carina.png", alt: "Nebulosa Carina" },
        { src: "/images/milky_way_desert.png", alt: "Vía Láctea desde el Desierto" },
        { src: "/images/deep_space_field.png", alt: "Espacio Profundo" },
        { src: "/images/spiral_galaxy.png", alt: "Galaxia Espiral" },
        { src: "/images/meteor_shower.png", alt: "Lluvia de Estrellas" },
        { src: "/images/earth_orbit.png", alt: "Órbita Terrestre" },
    ];

    return (
        <section id="gallery" className="py-20 px-6">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Galería <span className="text-starlight-gold">Astrofotográfica</span></h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedImage(photo)}
                            className={`rounded-xl overflow-hidden relative group cursor-pointer ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
                        >
                            <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover aspect-square md:aspect-auto" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                                    <ZoomIn className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-semibold text-sm">{photo.alt}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-[60] bg-deep-space-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        >
                            <button
                                className="absolute top-6 right-6 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={40} />
                            </button>

                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="max-w-full max-h-[85vh] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <p className="absolute bottom-10 text-white font-medium text-lg tracking-wide">
                                {selectedImage.alt}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
