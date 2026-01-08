import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                // Import the service dynamic or static
                const { fetchSpaceNews } = await import('../services/newsService');
                const news = await fetchSpaceNews();
                setNewsItems(news);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, []);

    return (
        <section id="news" className="py-20 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Noticias <span className="text-starlight-gold">Galácticas</span></h2>
                        <p className="text-gray-400">Últimas actualizaciones del cosmos en tiempo real.</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex" onClick={() => window.open('https://spacenews.com/', '_blank')}>Ver Más Fuentes</Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsItems.map((item, index) => (
                            <NewsCard key={index} {...item} />
                        ))}
                    </div>
                )}

                <div className="mt-8 flex md:hidden justify-center">
                    <Button variant="outline" onClick={() => window.open('https://spacenews.com/', '_blank')}>Ver Más Fuentes</Button>
                </div>
            </div>
        </section>
    );
};

export default News;
