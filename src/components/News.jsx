import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { db } from '../lib/db';
import RealtimeEventCard from './RealtimeEventCard';

const NewsCard = ({ title, date, excerpt, image, url }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="bg-navy-blue/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group flex flex-col h-full"
    >
        <div className="h-48 overflow-hidden relative">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space-black/80 to-transparent"></div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <span className="text-electric-cyan text-xs font-semibold uppercase tracking-wider mb-2">{new Date(date).toLocaleDateString()}</span>
            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">{title}</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3 flax-grow">{excerpt}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="mt-auto text-starlight-gold text-sm font-semibold hover:text-white transition-colors flex items-center gap-2">
                Leer Noticia Completa &rarr;
            </a>
        </div>
    </motion.div>
);

const News = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [liveEvents, setLiveEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Load parallel
                const { fetchSpaceNews } = await import('../services/newsService');
                const [news, allEvents] = await Promise.all([
                    fetchSpaceNews(),
                    db.getEvents()
                ]);

                setNewsItems(news);
                setLiveEvents(allEvents.filter(e => e.type === 'realtime'));
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    return (
        <section id="news" className="py-20 px-6">
            <div className="container mx-auto">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Actualidad y <span className="text-starlight-gold">Fenómenos En Vivo</span>
                    </h2>
                    <p className="text-gray-400">Noticias y eventos astronómicos ocurriendo ahora mismo.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* News Column (2/3) */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 bg-electric-cyan rounded-full"></span>
                                    Noticias Galácticas
                                </h3>
                                <Button variant="ghost" size="sm" onClick={() => window.open('https://spacenews.com/', '_blank')} className="text-xs text-gray-400 hover:text-white">
                                    Ver Más Fuentes
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {newsItems.slice(0, 4).map((item, index) => (
                                    <NewsCard key={index} {...item} />
                                ))}
                            </div>
                        </div>

                        {/* Live Events Column (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    En Vivo / Próximo
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {liveEvents.length > 0 ? (
                                    liveEvents.map((event) => (
                                        <RealtimeEventCard key={event.id} {...event} />
                                    ))
                                ) : (
                                    <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/10">
                                        <p className="text-gray-400 text-sm">No hay fenómenos en vivo reportados en este momento.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default News;
