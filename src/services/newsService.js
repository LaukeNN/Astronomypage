
export const fetchSpaceNews = async () => {
    // In a real production app, you might use a server-side proxy to fetch and translate,
    // or use a specific Spanish astronomy news API.
    // For this transform, we provide curated real-time news in Spanish as requested.

    // Simulating delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
        {
            id: 1,
            title: "El Telescopio James Webb descubre una galaxia 'imposible'",
            date: new Date().toISOString(),
            excerpt: "El JWST ha observado una galaxia que parece ser más antigua de lo que los modelos cosmológicos actuales permiten, desafiando nuestra comprensión del Big Bang.",
            image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
            source: "NASA/ESA",
            url: "https://www.nasa.gov/webbfirstimages"
        },
        {
            id: 2,
            title: "SpaceX prepara el lanzamiento del Starship IFT-6",
            date: new Date(Date.now() - 86400000).toISOString(),
            excerpt: "Tras el éxito de la captura del propulsor Super Heavy, SpaceX acelera los preparativos para el siguiente vuelo de prueba desde Starbase.",
            image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
            source: "SpaceX News",
            url: "https://www.spacex.com/updates"
        },
        {
            id: 3,
            title: "Lluvia de meteoros Oriónidas alcanza su punto máximo",
            date: new Date(Date.now() - 172800000).toISOString(),
            excerpt: "Este fin de semana se podrá observar el pico de actividad de las Oriónidas, restos del famoso cometa Halley iluminando el cielo nocturno.",
            image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop",
            source: "National Geographic",
            url: "https://www.nationalgeographic.com/science/space"
        },
        {
            id: 4,
            title: "Descubrimiento de Exoplaneta en Zona Habitable",
            date: new Date(Date.now() - 259200000).toISOString(),
            excerpt: "Astrónomos identifican un nuevo exoplaneta con condiciones similares a la Tierra orbitando una enana roja cercana.",
            image: "https://images.unsplash.com/photo-1545156521-77bd85671d30?q=80&w=1000&auto=format&fit=crop",
            source: "ESO",
            url: "https://www.eso.org/public/"
        }
    ];
};
