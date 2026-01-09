
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! Soy AstroGuía 🤖. Tu asistente de IA conectado al cosmos. Pregúntame sobre el universo, o pide ayuda con los eventos. ¿En qué puedo ayudarte?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    // Listen for external open triggers (e.g. from Events)
    useEffect(() => {
        const handleOpen = (e) => {
            setIsOpen(true);
            if (e.detail?.message) {
                setInputValue(e.detail.message);
                // Optional: Auto-send could be implemented here
            }
        };
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Process Intelligence
        try {
            // Import here to avoid circular dependency issues if any, or standard import
            const { chatWithAI } = await import('../lib/ai');
            const responseText = await chatWithAI(userMessage.text, messages);

            setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Lo siento, perdí la conexión con la base estelar.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 font-sans">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="bg-deep-space-black/95 border border-electric-cyan/30 backdrop-blur-md w-80 md:w-96 rounded-2xl shadow-2xl mb-4 overflow-hidden flex flex-col h-[500px]"
                        >
                            <div className="bg-gradient-to-r from-navy-blue to-deep-space-black p-4 flex justify-between items-center border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="bg-electric-cyan/20 p-2 rounded-full relative">
                                        <Sparkles className="text-electric-cyan w-5 h-5" />
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">AstroGuía AI</h3>
                                        <span className="text-xs text-starlight-gold flex items-center gap-1">
                                            Online &bull; v2.0
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.sender === 'user'
                                                ? 'bg-electric-cyan/10 text-electric-cyan rounded-tr-none border border-electric-cyan/20'
                                                : 'bg-white/5 text-gray-100 rounded-tl-none border border-white/10'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 text-white rounded-2xl rounded-tl-none p-4 flex gap-1 items-center border border-white/5">
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.5 }}
                                                className="w-1.5 h-1.5 bg-electric-cyan rounded-full"
                                            ></motion.span>
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }}
                                                className="w-1.5 h-1.5 bg-starlight-gold rounded-full"
                                            ></motion.span>
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }}
                                                className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                                            ></motion.span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/40">
                                <form
                                    className="flex gap-2"
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Pregunta al universo..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-cyan transition-colors placeholder:text-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-electric-cyan text-deep-space-black p-2 rounded-full hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                        disabled={!inputValue.trim()}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gradient-to-tr from-electric-cyan to-blue-600 text-deep-space-black p-4 rounded-full shadow-[0_0_30px_rgba(0,243,255,0.3)] relative border border-white/20 group"
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-starlight-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-starlight-gold border-2 border-deep-space-black"></span>
                        </span>
                    )}
                </motion.button>
            </div>
        </>
    );
};


export default Chatbot;
