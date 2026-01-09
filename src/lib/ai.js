
import { db } from "./db";
import { pageInfo } from "../data/knowledgeBase";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "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";

// Fallback/Simulation Knowledge Base if no API Key
const SIMULATED_RESPONSES = [
    {
        keywords: ["hola", "saludos"],
        response: "¡Saludos, explorador estelar! Soy AstroGuía. Mi misión es conectarte con el conocimiento del universo. ¿En qué puedo ayudarte hoy? 🚀"
    },
    {
        keywords: ["negro", "black hole"],
        response: "Los agujeros negros son regiones del espacio con una gravedad tan intensa que nada, ni siquiera la luz, puede escapar de ellos. Se forman cuando estrellas masivas colapsan al final de sus vidas. ¿Te gustaría saber sobre Sagitario A*, el que está en el centro de nuestra galaxia? 🕳️"
    },
    {
        keywords: ["luna", "moon"],
        response: "La Luna es el único satélite natural de la Tierra. Se formó hace unos 4.5 mil millones de años, probablemente tras un gran impacto. Actualmente, nos estamos preparando para volver a ella con el programa Artemis. ¿Quieres saber cuándo será el próximo alunizaje?"
    },
    {
        keywords: ["marte", "mars"],
        response: "Marte, el planeta rojo, es el objetivo principal para la futura exploración humana. Tiene el volcán más grande del sistema solar, el Monte Olimpo. ¡Espero que algún día podamos visitarlo juntos! 🔴"
    },
    {
        keywords: ["evento", "reserva"],
        response: "Para eventos y reservas, por favor consulta nuestra sección de 'Eventos'. Ahí encontrarás expediciones de observación y lanzamientos en vivo."
    }
];

export const chatWithAI = async (message, history = []) => {
    try {
        // 1. Check for real API Key
        const isPlaceholder = !API_KEY || API_KEY.includes("PON_TU_API_KEY") || API_KEY.length < 10;

        if (!isPlaceholder) {
            // Fetch dynamic context data
            let events = [];
            try {
                events = await db.getEvents();
            } catch (err) {
                console.warn("Could not fetch events for AI context", err);
            }

            const eventsContext = events.map(e =>
                `- ${e.title} (${e.date.day} ${e.date.month}): ${e.description || "Evento de reservación"}. Lugar: ${e.location}. Precio: ${e.price ? "$" + e.price + " USD" : "Gratis/Online"}.`
            ).join("\n");

            const pageContext = pageInfo.map(qa => `- ${qa.answer}`).join("\n");

            const systemPrompt = `Eres AstroGuía, el asistente IA oficial de "Cielo Abierto".

            PERSONALIDAD Y FORMATO:
            - CONCISO: Tus respuestas deben ser breves (máximo 2-3 oraciones o viñetas cortos). Ve al grano.
            - FORMATO: Escribe SIEMPRE en oraciones separadas o listas con viñetas para facilitar la lectura inmediata. No uses párrafos largos.
            - CURIOSO: Usa un tono entusiasta pero profesional.
            - IDIOMA: Español.

            TU MISIÓN:
            1. PREGUNTAS DE ASTRONOMÍA: Responde con datos precisos pero resumidos. Si es algo complejo, da el dato clave y pregunta si quieren saber más detalles.
            2. SOBRE LA PÁGINA: Guía a los usuarios a la sección correcta (Eventos, Contacto, etc.).
            
            CONTEXTO DE EVENTOS (Usa esta info):
            ${eventsContext}

            INFORMACIÓN GENERAL:
            ${pageContext}
            Pago: PayPal.
            
            IMPORTANTE: No inventes eventos. Si no sabes, dilo brevemente y sugiere contactar a soporte (alvarogarciamaxwell@gmail.com).`;

            // Map history to OpenRouter/OpenAI format
            const messages = [
                { role: "system", content: systemPrompt },
                ...history.filter(h => h.id !== 1).map(h => ({
                    role: h.sender === 'bot' ? 'assistant' : 'user',
                    content: h.text
                })),
                { role: "user", content: message }
            ];

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin, // Required by OpenRouter
                    "X-Title": "Cielo Abierto Astronomy Web", // Optional
                },
                body: JSON.stringify({
                    "model": "xiaomi/mimo-v2-flash:free",
                    "messages": messages,
                    "temperature": 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Error al conectar con OpenRouter");
            }

            const data = await response.json();
            return data.choices[0].message.content;
        }

        // 2. Fallback / Warning if No Key
        console.warn("OpenRouter API Key missing or invalid. Using simulation.");

        if (message.toLowerCase().includes("api") || message.toLowerCase().includes("openrouter")) {
            return "Para conectarme con mi red neuronal completa via OpenRouter, necesitas configurar la API Key.";
        }

        // 3. Simulation Logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("lanzamiento") && lowerMsg.includes("spacex")) {
            return "¡Oh! El lanzamiento de SpaceX es un evento emocionante. El Starship Flight 6 está programado para enero. Puedes ver los detalles en la pestaña de 'Fenómenos en Vivo' en la sección de Noticias. ¡No te lo pierdas! 🚀";
        }

        const match = SIMULATED_RESPONSES.find(r => r.keywords.some(k => lowerMsg.includes(k)));
        if (match) return match.response;

        return "Esa es una pregunta fascinante. Actualmente estoy operando en modo de simulación. Por favor configura mi API Key para acceder a todo mi conocimiento. ✨";

    } catch (error) {
        console.error("AI Error:", error);
        return "Mis sensores detectan una interferencia en la red galáctica. Es posible que haya un problema con la API Key o la conexión. Por favor intenta de nuevo más tarde o contacta a soporte humano en alvarogarciamaxwell@gmail.com 📡";
    }
};
