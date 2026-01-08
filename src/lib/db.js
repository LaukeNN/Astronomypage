
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
        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 102,
        title: "Eclipse Solar Parcial",
        date: { day: "17", month: "FEB" },
        location: "Hemisferio Sur",
        time: "10:30 UTC",
        type: 'realtime',
        description: "Un eclipse parcial será visible desde la Antártida y partes del sur de América.",
        image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=1000"
    }
];

// Helper to get local data
const getLocalData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const setLocalData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
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
            const events = getLocalData('events') || INITIAL_EVENTS;
            if (!getLocalData('events')) setLocalData('events', INITIAL_EVENTS);
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

    // Auth (Mock only, Supabase auth is handled by auth.js)
    loginMock: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        const users = getLocalData('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error("Credenciales inválidas");
        const { password: _, ...userWithoutPass } = user;
        return userWithoutPass;
    },

    registerMock: async (email, password, name) => {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        const users = getLocalData('users') || [];
        if (users.find(u => u.email === email)) throw new Error("El usuario ya existe");

        const newUser = { id: Date.now(), email, password, name }; // In real app, hash password!
        users.push(newUser);
        setLocalData('users', users);
        const { password: _, ...userWithoutPass } = newUser;
        return userWithoutPass;
    }
};
