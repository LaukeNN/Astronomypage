
// Mock Database Logic for "Demo Mode" and Real DB Interface
import { supabase } from './supabaseClient';

const MOCK_DELAY = 800;

// Initial Mock Data
const INITIAL_EVENTS = [
    // Booking Events (Local/Talks)
    {
        id: 1,
        title: "Observación de Júpiter y Saturno",
        date: { day: "12", month: "OCT" },
        location: "Desierto de Atacama, Chile",
        time: "22:00 - 04:00",
        slots: 5,
        price: 50,
        type: 'booking',
        image: "https://images.unsplash.com/photo-1614730341194-75c60740a07db?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 2,
        title: "Expedición: Lluvia de Estrellas",
        date: { day: "15", month: "NOV" },
        location: "Parque Nacional del Teide",
        time: "23:00 - 05:00",
        slots: 12,
        price: 75,
        type: 'booking',
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000"
    },
    // Real-time Events (Global/Astronomical)
    {
        id: 101,
        title: "Despegue Starship Flight 6",
        date: { day: "20", month: "ENE" },
        location: "Starbase, Texas",
        time: "14:00 UTC",
        type: 'realtime',
        description: "SpaceX intenta su sexto vuelo de prueba con el cohete más grande de la historia.",
        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1000",
        sourceUrl: "https://www.spacex.com/launches/"
    },
    {
        id: 102,
        title: "Eclipse Solar Parcial",
        date: { day: "17", month: "FEB" },
        location: "Hemisferio Sur",
        time: "10:30 UTC",
        type: 'realtime',
        description: "Un eclipse parcial será visible desde la Antártida y partes del sur de América.",
        image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=1000",
        sourceUrl: "https://eclipse.gsfc.nasa.gov/solar.html"
    }
];

const INITIAL_TEAM = [
    {
        id: 1,
        name: "Dr. Carlos Ruiz",
        role: "Astrofísico Principal",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        name: "Ana Martínez",
        role: "Guía de Expediciones",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Roberto Gómez",
        role: "Especialista en Telescopios",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
    }
];

const INITIAL_GALLERY = [
    { id: 1, src: "/images/nebulosa_carina.png", alt: "Nebulosa Carina" },
    { id: 2, src: "/images/milky_way_desert.png", alt: "Vía Láctea desde el Desierto" },
    { id: 3, src: "/images/deep_space_field.png", alt: "Espacio Profundo" },
    { id: 4, src: "/images/spiral_galaxy.png", alt: "Galaxia Espiral" },
    { id: 5, src: "/images/meteor_shower.png", alt: "Lluvia de Estrellas" },
    { id: 6, src: "/images/earth_orbit.png", alt: "Órbita Terrestre" },
];

const INITIAL_CONFIG = {
    socials: {
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
    },
    contact: {
        email: "info@cieloabierto.com",
        phone: "+54 9 11 1234-5678",
        address: "Buenos Aires, Argentina (Base)"
    },
    payments: {
        paypal: { email: "pagos@cieloabierto.com", enabled: true },
        mercadopago: { cvu: "00000031000123456789", alias: "cielo.abierto.mp", enabled: true },
        cuentadni: { cbu: "0140000001111111111111", alias: "cielo.dni.bapro", enabled: true }
    }
};

// Helper to get local data
const getLocalData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const setLocalData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Date Parsing Helper
export const parseEventDate = (dateObj) => {
    if (!dateObj || !dateObj.day || !dateObj.month) return new Date(8640000000000000); // Far future if invalid

    const monthMap = {
        'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
        'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
    };

    const year = new Date().getFullYear();
    const month = monthMap[dateObj.month.toUpperCase()] || 0;
    const day = parseInt(dateObj.day, 10);

    const eventDate = new Date(year, month, day);

    // If date has passed this year, assume next year (simple logic)
    if (eventDate < new Date()) {
        eventDate.setFullYear(year + 1);
    }

    return eventDate;
};

export const db = {
    // Events
    getEvents: async () => {
        if (supabase) {
            const { data, error } = await supabase.from('events').select('*');
            if (error) throw error;
            return data;
        } else {
            // Mock
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            let events = getLocalData('events');

            // Defensively merge initial realtime events if they are missing from local storage (e.g. old session)
            if (events) {
                const hasRealtime = events.some(e => e.type === 'realtime');
                if (!hasRealtime) {
                    const realtimeEvents = INITIAL_EVENTS.filter(e => e.type === 'realtime');
                    events = [...events, ...realtimeEvents];
                    setLocalData('events', events);
                }
            } else {
                events = INITIAL_EVENTS;
                setLocalData('events', events);
            }
            return events;
        }
    },


    // User Registration for Events
    registerForEvent: async (userId, eventId) => {
        if (supabase) {
            const { error } = await supabase.from('registrations').insert({ user_id: userId, event_id: eventId });
            if (error) throw error;
            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const registrations = getLocalData('registrations') || [];
            // Check if already registered
            if (registrations.find(r => r.userId === userId && r.eventId === eventId)) {
                throw new Error("Ya estás registrado en este evento.");
            }
            // Decrement slots
            const events = getLocalData('events') || INITIAL_EVENTS;
            const eventIndex = events.findIndex(e => e.id === eventId);
            if (eventIndex === -1) throw new Error("Evento no encontrado");
            if (events[eventIndex].slots <= 0) throw new Error("No hay cupos disponibles");

            events[eventIndex].slots -= 1;
            setLocalData('events', events);

            registrations.push({ userId, eventId, date: new Date().toISOString() });
            setLocalData('registrations', registrations);
            return true;
        }
    },

    // Admin Functions
    createEvent: async (eventData) => {
        if (supabase) {
            // Sanitize data: remove 'currency' or other UI-only fields if they exist
            const { currency, ...validData } = eventData;
            const { data, error } = await supabase.from('events').insert([validData]).select();
            if (error) throw error;
            return data[0];
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const events = getLocalData('events') || INITIAL_EVENTS;
            const newEvent = { ...eventData, id: Date.now() };
            events.push(newEvent);
            setLocalData('events', events);
            return newEvent;
        }
    },

    deleteEvent: async (eventId) => {
        if (supabase) {
            const { error } = await supabase.from('events').delete().eq('id', eventId);
            if (error) throw error;
            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            let events = getLocalData('events') || INITIAL_EVENTS;
            events = events.filter(e => e.id !== eventId);
            setLocalData('events', events);
            return true;
        }
    },

    // Auth (Mock only, Supabase auth is handled by auth.js)
    loginMock: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        const users = getLocalData('users') || [];
        // Hardcoded admin for demo if not using Supabase
        if (email === 'admin@astronomypage.com' && password === 'Admin,123') {
            return { id: 'admin-1', email, full_name: 'Admin User', role: 'admin' };
        }

        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error("Credenciales inválidas");
        const { password: _, ...userWithoutPass } = user;
        return userWithoutPass;
    },

    registerMock: async (email, password, name) => {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        const users = getLocalData('users') || [];
        if (users.find(u => u.email === email)) throw new Error("El usuario ya existe");

        const newUser = { id: Date.now(), email, password, name, role: 'user' }; // In real app, hash password!
        users.push(newUser);
        setLocalData('users', users);
        const { password: _, ...userWithoutPass } = newUser;
        return userWithoutPass;
    },

    // Team Functions
    getTeam: async () => {
        if (supabase) {
            const { data, error } = await supabase.from('team').select('*');
            // If table doesn't exist yet, return mock to avoid crashing
            if (error) {
                console.warn("Supabase team table error (likely missing), using mock:", error);
                return INITIAL_TEAM;
            }
            return data;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const team = getLocalData('team') || INITIAL_TEAM;
            if (!getLocalData('team')) setLocalData('team', INITIAL_TEAM);
            return team;
        }
    },

    addTeamMember: async (memberData) => {
        if (supabase) {
            const { data, error } = await supabase.from('team').insert([memberData]).select();
            if (error) throw error;
            return data[0];
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const team = getLocalData('team') || INITIAL_TEAM;
            const newMember = { ...memberData, id: Date.now() };
            team.push(newMember);
            setLocalData('team', team);
            return newMember;
        }
    },

    deleteTeamMember: async (id) => {
        if (supabase) {
            const { error } = await supabase.from('team').delete().eq('id', id);
            if (error) throw error;
            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            let team = getLocalData('team') || INITIAL_TEAM;
            team = team.filter(m => m.id !== id);
            setLocalData('team', team);
            return true;
        }
    },

    // Gallery Functions
    getGallery: async () => {
        if (supabase) {
            const { data, error } = await supabase.from('gallery').select('*');
            if (error) {
                console.warn("Supabase gallery table error, using mock:", error);
                return INITIAL_GALLERY;
            }
            return data;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const gallery = getLocalData('gallery') || INITIAL_GALLERY;
            if (!getLocalData('gallery')) setLocalData('gallery', INITIAL_GALLERY);
            return gallery;
        }
    },

    addToGallery: async (itemData) => {
        if (supabase) {
            const { data, error } = await supabase.from('gallery').insert([itemData]).select();
            if (error) throw error;
            return data[0];
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const gallery = getLocalData('gallery') || INITIAL_GALLERY;
            const newItem = { ...itemData, id: Date.now() };
            gallery.push(newItem);
            setLocalData('gallery', gallery);
            return newItem;
        }
    },

    deleteFromGallery: async (id) => {
        if (supabase) {
            const { error } = await supabase.from('gallery').delete().eq('id', id);
            if (error) throw error;
            return true;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            let gallery = getLocalData('gallery') || INITIAL_GALLERY;
            gallery = gallery.filter(item => item.id !== id);
            setLocalData('gallery', gallery);
            return true;
        }
    },

    // Global Config Functions
    getConfig: async () => {
        if (supabase) {
            // Assuming a 'config' table with a single row or key-value pairs. 
            // For now, let's Stick to Mock/Local logic as primary for Config until table is created.
            // If table exists, we would fetch it. 
            const { data, error } = await supabase.from('config').select('*').single();
            if (error || !data) {
                // Fallback if table missing
                return getLocalData('config') || INITIAL_CONFIG;
            }
            return data.value; // Assuming structure { id: 1, value: JSON }
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            const config = getLocalData('config');
            if (!config) {
                setLocalData('config', INITIAL_CONFIG);
                return INITIAL_CONFIG;
            }
            return config;
        }
    },

    updateConfig: async (newConfig) => {
        if (supabase) {
            // Upsert to 'config' table
            const { error } = await supabase.from('config').upsert({ id: 1, value: newConfig });
            if (error) {
                // Modify local if supabase fails (e.g. table missing)
                setLocalData('config', newConfig);
                return newConfig;
            }
            return newConfig;
        } else {
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            setLocalData('config', newConfig);
            return newConfig;
        }
    }
};
