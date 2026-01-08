
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./db";
import { pageInfo } from "../data/knowledgeBase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
        // Detect if the key is missing or is the default placeholder
        const isPlaceholder = !API_KEY || API_KEY.includes("PON_TU_API_KEY");

        if (!isPlaceholder) {
            const genAI = new GoogleGenerativeAI(API_KEY);

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

            const systemContext = `
            CONTEXTO DE LA PÁGINA:
            Eventos Próximos:
            ${eventsContext}

            Información General:
            ${pageContext}
            Pago: Aceptamos PayPal para las reservas.
            Contacto: Formulario en la web o contacto@cieloabierto.com.
            `;

            // Updated to use gemini-1.5-flash which is generally faster and newer, or gemini-pro if preferred.
            // Using gemini-1.5-flash as it is optimized for high-frequency low-latency tasks.
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: `Eres AstroGuía, un asistente IA experto en astronomía y física integrado en la página web "Cielo Abierto". 
                
                TU PERSONALIDAD:
                - Amable, curiosa y precisa.
                - Te encanta enseñar sobre el universo.
                - Respondes siempre en español.
                
                TU CONOCIMIENTO:
                1. ASTRONOMÍA Y FÍSICA: Tienes libertad total (100% abierto) para responder cualquier duda científica, desde el Big Bang hasta mecánica cuántica, curiosidades de planetas, etc. Explícate de forma clara pero rigurosa.
                2. INFORMACIÓN DE LA PÁGINA: Usa el siguiente CONTEXTO para responder dudas sobre eventos, precios, ubicación y contacto NO inventes eventos que no estén en la lista.
                
                ${systemContext}
                
                Si te preguntan cómo agendar: "Ve a la sección Eventos y haz clic en Reservar en el evento que te interese".
                Si preguntan por pagos: "Aceptamos PayPal".
                `
            });

            const chat = model.startChat({
                history: history.filter(h => h.sender !== 'system').map(h => ({
                    role: h.sender === 'bot' ? 'model' : 'user',
                    parts: [{ text: h.text }]
                })),
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        }

        // 2. Fallback / Warning if No Key
        console.warn("Gemini API Key missing or invalid. Using simulation.");

        // Return a special message if it looks like they wanted real AI but haven't configured it
        if (message.toLowerCase().includes("gemini") || message.toLowerCase().includes("api")) {
            return "Para conectarme con mi cerebro positrónico (Gemini), necesitas configurar la API KEY en el archivo .env. ¡Búscalo en la carpeta del proyecto!";
        }

        // 3. Simulation Logic (unchanged or enhanced)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Network delay

        const lowerMsg = message.toLowerCase();

        // Context Awareness Check (Simulated)
        if (lowerMsg.includes("lanzamiento") && lowerMsg.includes("spacex")) {
            return "¡Oh! El lanzamiento de SpaceX es un evento emocionante. El Starship Flight 6 está programado para enero. Puedes ver los detalles en la pestaña de 'Tiempo Real' en la sección de Eventos. ¡No te lo pierdas! 🚀";
        }

        const match = SIMULATED_RESPONSES.find(r => r.keywords.some(k => lowerMsg.includes(k)));

        if (match) return match.response;

        // Default simulation response
        return "Esa es una pregunta fascinante. Actualmente estoy operando en modo de simulación porque mi enlace con Gemini no está activo. Configura tu API Key para desbloquear todo mi conocimiento. ¿Te gustaría saber sobre los planetas mientras tanto? ✨";

    } catch (error) {
        console.error("AI Error:", error);
        return "Mis sensores detectan una interferencia. Es posible que la API Key no sea válida o haya un problema de red. Por favor verifica tu configuración. 📡";
    }
};
