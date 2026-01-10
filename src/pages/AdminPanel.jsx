import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Trash2, Plus, Calendar, MapPin, DollarSign, Image as ImageIcon, Rocket, Users, Clock, Upload, Camera, Settings, CreditCard, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Reusable Image Input Component ---
const ImageInput = ({ value, onChange, label = "Imagen" }) => {
    const [mode, setMode] = useState('url'); // 'url' | 'file'

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check size (limit to ~2MB for base64 sanity in demo)
            if (file.size > 2 * 1024 * 1024) {
                alert("La imagen es muy pesada (Max 2MB para esta demo).");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <div className="flex gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${mode === 'url' ? 'bg-electric-cyan text-deep-space-black border-electric-cyan font-bold' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                >
                    Enlace URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode('file')}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${mode === 'file' ? 'bg-electric-cyan text-deep-space-black border-electric-cyan font-bold' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                >
                    Subir Archivo
                </button>
            </div>

            {mode === 'url' ? (
                <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 pl-9 text-white focus:border-electric-cyan outline-none"
                        placeholder="https://..."
                    />
                </div>
            ) : (
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-electric-cyan/10 file:text-electric-cyan hover:file:bg-electric-cyan/20 cursor-pointer"
                    />
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-white/20 bg-black/40 group">
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

const AdminPanel = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Data State
    const [events, setEvents] = useState([]);
    const [team, setTeam] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events'); // 'events' | 'team' | 'gallery' | 'config'

    // Form Loading States
    const [createEventLoading, setCreateEventLoading] = useState(false);
    const [createTeamLoading, setCreateTeamLoading] = useState(false);
    const [createGalleryLoading, setCreateGalleryLoading] = useState(false);
    const [saveConfigLoading, setSaveConfigLoading] = useState(false);

    // Forms State
    const [eventForm, setEventForm] = useState({
        title: '', date: '', time: '', location: '', address: '',
        image: '', price: '', currency: 'USD', description: ''
    });

    const [teamForm, setTeamForm] = useState({
        name: '', role: '', expertise: '', image: ''
    });

    const [galleryForm, setGalleryForm] = useState({
        src: '', alt: ''
    });

    // Config Form is derived from loaded config, so it's initialized in useEffect/fetchData

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        try {
            const [eventsData, teamData, galleryData, configData] = await Promise.all([
                db.getEvents(),
                db.getTeam(),
                db.getGallery(),
                db.getConfig()
            ]);
            setEvents(eventsData.filter(e => e.type === 'booking'));
            setTeam(teamData);
            setGallery(galleryData);
            setConfig(configData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- generic Handlers ---
    const handleInputChange = (setter) => (e) => {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value }));
    };

    // --- Config Handlers ---
    const handleConfigChange = (section, key, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleConfigSubmit = async (e) => {
        e.preventDefault();
        setSaveConfigLoading(true);
        try {
            await db.updateConfig(config);
            alert("¡Configuración guardada exitosamente!");
        } catch (error) {
            console.error("Error saving config:", error);
            alert("Error al guardar configuración.");
        } finally {
            setSaveConfigLoading(false);
        }
    };

    // --- Event Handlers ---
    const handleEventSubmit = async (e) => {
        e.preventDefault();
        setCreateEventLoading(true);
        try {
            const [year, monthNum, day] = eventForm.date.split('-');
            const monthMap = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
            const month = monthMap[parseInt(monthNum) - 1];

            const eventPayload = {
                title: eventForm.title,
                date: { day, month, year: parseInt(year) },
                location: eventForm.location + (eventForm.address ? `, ${eventForm.address}` : ''),
                time: eventForm.time,
                image: eventForm.image,
                price: eventForm.price,
                currency: eventForm.currency,
                description: eventForm.description,
                type: 'booking',
                slots: 20
            };

            await db.createEvent(eventPayload);
            await fetchData();
            setEventForm({ title: '', date: '', time: '', location: '', address: '', image: '', price: '', currency: 'USD', description: '' });
            alert("¡Evento creado!");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setCreateEventLoading(false);
        }
    };

    // --- Team Handlers ---
    const handleTeamSubmit = async (e) => {
        e.preventDefault();
        setCreateTeamLoading(true);
        try {
            await db.addTeamMember(teamForm);
            await fetchData();
            setTeamForm({ name: '', role: '', expertise: '', image: '' });
            alert("¡Miembro añadido!");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setCreateTeamLoading(false);
        }
    };

    // --- Gallery Handlers ---
    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        setCreateGalleryLoading(true);
        try {
            await db.addToGallery(galleryForm);
            await fetchData();
            setGalleryForm({ src: '', alt: '' });
            alert("¡Imagen añadida a la galería!");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setCreateGalleryLoading(false);
        }
    };

    // --- Delete Handlers ---
    const handleDelete = async (type, id) => {
        if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;
        try {
            if (type === 'event') await db.deleteEvent(id);
            if (type === 'team') await db.deleteTeamMember(id);
            if (type === 'gallery') await db.deleteFromGallery(id);

            // Optimistic update
            if (type === 'event') setEvents(prev => prev.filter(i => i.id !== id));
            if (type === 'team') setTeam(prev => prev.filter(i => i.id !== id));
            if (type === 'gallery') setGallery(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error al eliminar.");
        }
    };

    if (authLoading) return <div className="min-h-screen bg-deep-space-black flex items-center justify-center text-white flex-col gap-4"><div className="w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full animate-spin"></div><p>Verificando sesión...</p></div>;

    if (loading) return <div className="min-h-screen bg-deep-space-black flex items-center justify-center text-white flex-col gap-4"><div className="w-8 h-8 border-4 border-starlight-gold border-t-transparent rounded-full animate-spin"></div><p>Cargando datos del panel...</p></div>;

    return (
        <div className="min-h-screen bg-deep-space-black text-gray-100 font-sans pt-20 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-cyan to-purple-500">Panel Admin</h1>
                        <p className="text-gray-400 mt-2">Gestión integral de contenidos.</p>
                    </div>
                    <Link to="/" className="text-electric-cyan hover:underline flex items-center gap-2">
                        <Rocket size={20} /> Volver a la Web
                    </Link>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {[
                        { id: 'events', label: 'Eventos', icon: Calendar, color: 'bg-electric-cyan' },
                        { id: 'team', label: 'Equipo', icon: Users, color: 'bg-starlight-gold' },
                        { id: 'gallery', label: 'Galería', icon: Camera, color: 'bg-purple-500' },
                        { id: 'config', label: 'Configuración', icon: Settings, color: 'bg-gray-400' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? `${tab.color} text-deep-space-black` : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Create / Form Section (Takes full width for Config) */}
                    <div className={activeTab === 'config' ? 'lg:col-span-3' : 'lg:col-span-1'}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">

                            {/* EVENT FORM */}
                            {activeTab === 'events' && (
                                <form onSubmit={handleEventSubmit} className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-electric-cyan" /> Nuevo Evento</h2>
                                    <div><label className="text-sm text-gray-400">Título</label><input type="text" name="title" value={eventForm.title} onChange={handleInputChange(setEventForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none" required /></div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-sm text-gray-400">Fecha</label><input type="date" name="date" value={eventForm.date} onChange={handleInputChange(setEventForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none" required /></div>
                                        <div><label className="text-sm text-gray-400">Hora</label><input type="time" name="time" value={eventForm.time} onChange={handleInputChange(setEventForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none" required /></div>
                                    </div>
                                    <div><label className="text-sm text-gray-400">Ubicación</label><input type="text" name="location" value={eventForm.location} onChange={handleInputChange(setEventForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none" required /></div>
                                    <ImageInput value={eventForm.image} onChange={(val) => setEventForm(prev => ({ ...prev, image: val }))} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-sm text-gray-400">Precio</label><input type="number" name="price" value={eventForm.price} onChange={handleInputChange(setEventForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none" /></div>
                                        <div><label className="text-sm text-gray-400">Moneda</label><select name="currency" value={eventForm.currency} onChange={handleInputChange(setEventForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-electric-cyan outline-none"><option value="USD">USD</option><option value="ARS">ARS</option></select></div>
                                    </div>
                                    <button type="submit" disabled={createEventLoading} className="w-full bg-electric-cyan text-deep-space-black font-bold py-3 rounded-lg hover:bg-white transition-colors">{createEventLoading ? 'Creando...' : 'Crear Evento'}</button>
                                </form>
                            )}

                            {/* TEAM FORM */}
                            {activeTab === 'team' && (
                                <form onSubmit={handleTeamSubmit} className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-starlight-gold" /> Nuevo Miembro</h2>
                                    <div><label className="text-sm text-gray-400">Nombre</label><input type="text" name="name" value={teamForm.name} onChange={handleInputChange(setTeamForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-starlight-gold outline-none" required /></div>
                                    <div><label className="text-sm text-gray-400">Rol</label><input type="text" name="role" value={teamForm.role} onChange={handleInputChange(setTeamForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-starlight-gold outline-none" required /></div>
                                    <div><label className="text-sm text-gray-400">Especialidad</label><input type="text" name="expertise" value={teamForm.expertise} onChange={handleInputChange(setTeamForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                    <ImageInput value={teamForm.image} onChange={(val) => setTeamForm(prev => ({ ...prev, image: val }))} label="Foto de Perfil" />
                                    <button type="submit" disabled={createTeamLoading} className="w-full bg-starlight-gold text-deep-space-black font-bold py-3 rounded-lg hover:bg-white transition-colors">{createTeamLoading ? 'Añadiendo...' : 'Añadir Miembro'}</button>
                                </form>
                            )}

                            {/* GALLERY FORM */}
                            {activeTab === 'gallery' && (
                                <form onSubmit={handleGallerySubmit} className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-purple-500" /> Nueva Imagen</h2>
                                    <div><label className="text-sm text-gray-400">Título / Descripción</label><input type="text" name="alt" value={galleryForm.alt} onChange={handleInputChange(setGalleryForm)} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-purple-500 outline-none" required /></div>
                                    <ImageInput value={galleryForm.src} onChange={(val) => setGalleryForm(prev => ({ ...prev, src: val }))} label="Archivo de Imagen" />
                                    <button type="submit" disabled={createGalleryLoading} className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-white hover:text-deep-space-black transition-colors">{createGalleryLoading ? 'Subiendo...' : 'Subir Imagen'}</button>
                                </form>
                            )}

                            {/* CONFIG FORM */}
                            {activeTab === 'config' && config && (
                                <form onSubmit={handleConfigSubmit} className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Settings className="text-gray-400" /> Configuración General</h2>
                                        <button type="submit" disabled={saveConfigLoading} className="bg-electric-cyan text-deep-space-black font-bold py-2 px-6 rounded-lg hover:bg-white transition-colors cursor-pointer disabled:opacity-50">{saveConfigLoading ? 'Guardando...' : 'Guardar Cambios'}</button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Redes y Contacto */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-starlight-gold flex items-center gap-2"><Share2 size={20} /> Redes & Contacto</h3>

                                            <div className="space-y-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                                <div><label className="text-sm text-gray-400">Instagram URL</label><input type="text" value={config.socials.instagram} onChange={(e) => handleConfigChange('socials', 'instagram', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                                <div><label className="text-sm text-gray-400">Twitter/X URL</label><input type="text" value={config.socials.twitter} onChange={(e) => handleConfigChange('socials', 'twitter', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                                <div><label className="text-sm text-gray-400">Facebook URL</label><input type="text" value={config.socials.facebook} onChange={(e) => handleConfigChange('socials', 'facebook', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                                <div className="pt-4 border-t border-white/10"></div>
                                                <div><label className="text-sm text-gray-400">Email de Contacto</label><input type="text" value={config.contact.email} onChange={(e) => handleConfigChange('contact', 'email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                                <div><label className="text-sm text-gray-400">Teléfono</label><input type="text" value={config.contact.phone} onChange={(e) => handleConfigChange('contact', 'phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                                <div><label className="text-sm text-gray-400">Dirección</label><input type="text" value={config.contact.address} onChange={(e) => handleConfigChange('contact', 'address', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:border-starlight-gold outline-none" /></div>
                                            </div>
                                        </div>

                                        {/* Pagos */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-electric-cyan flex items-center gap-2"><CreditCard size={20} /> Cuentas de Pago</h3>

                                            {/* Paypal */}
                                            <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-3">
                                                <h4 className="font-bold text-blue-400">PayPal</h4>
                                                <div><label className="text-sm text-gray-400">Email de Cuenta</label><input type="text" value={config.payments.paypal.email} onChange={(e) => handleConfigChange('payments', 'paypal', { ...config.payments.paypal, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white outline-none" /></div>
                                            </div>

                                            {/* Mercado Pago */}
                                            <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-3">
                                                <h4 className="font-bold text-blue-300">Mercado Pago</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div><label className="text-sm text-gray-400">CVU / CVU</label><input type="text" value={config.payments.mercadopago.cvu} onChange={(e) => handleConfigChange('payments', 'mercadopago', { ...config.payments.mercadopago, cvu: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white outline-none" /></div>
                                                    <div><label className="text-sm text-gray-400">Alias</label><input type="text" value={config.payments.mercadopago.alias} onChange={(e) => handleConfigChange('payments', 'mercadopago', { ...config.payments.mercadopago, alias: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white outline-none" /></div>
                                                </div>
                                            </div>

                                            {/* Cuenta DNI */}
                                            <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-3">
                                                <h4 className="font-bold text-green-500">Cuenta DNI</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div><label className="text-sm text-gray-400">CBU / CVU</label><input type="text" value={config.payments.cuentadni.cbu} onChange={(e) => handleConfigChange('payments', 'cuentadni', { ...config.payments.cuentadni, cbu: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white outline-none" /></div>
                                                    <div><label className="text-sm text-gray-400">Alias</label><input type="text" value={config.payments.cuentadni.alias} onChange={(e) => handleConfigChange('payments', 'cuentadni', { ...config.payments.cuentadni, alias: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded p-2 text-white outline-none" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>

                    {/* List Section (Only visible for non-config tabs) */}
                    {activeTab !== 'config' && (
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                <h2 className="text-xl font-bold text-white capitalize">Gestión de {activeTab === 'team' ? 'Equipo' : activeTab}</h2>
                                <span className="text-sm text-gray-400">Total: {activeTab === 'events' ? events.length : activeTab === 'team' ? team.length : gallery.length}</span>
                            </div>

                            <div className="grid gap-4">
                                <AnimatePresence mode="popLayout">
                                    {/* EVENT LIST */}
                                    {activeTab === 'events' && events.map((event) => (
                                        <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 justify-between items-center group">
                                            <div className="flex gap-4 items-center">
                                                <img src={event.image || "https://via.placeholder.com/150"} alt="" className="w-16 h-16 rounded-lg object-cover bg-black/30" />
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                                    <p className="text-sm text-gray-400">{event.date.day} {event.date.month} • {event.location}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete('event', event.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={20} /></button>
                                        </motion.div>
                                    ))}

                                    {/* TEAM LIST */}
                                    {activeTab === 'team' && team.map((member) => (
                                        <motion.div key={member.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 justify-between items-center group">
                                            <div className="flex gap-4 items-center">
                                                <img src={member.image} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                                                    <p className="text-starlight-gold text-sm">{member.role}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete('team', member.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={20} /></button>
                                        </motion.div>
                                    ))}

                                    {/* GALLERY LIST */}
                                    {activeTab === 'gallery' && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                            {gallery.map((item) => (
                                                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group relative aspect-square">
                                                    <img src={item.src || item.image} alt={item.alt} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                                        <p className="text-white text-xs font-bold mb-2 line-clamp-2">{item.alt}</p>
                                                        <button onClick={() => handleDelete('gallery', item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><Trash2 size={16} /></button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
