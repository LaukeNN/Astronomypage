import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, CreditCard, Heart } from 'lucide-react';
import { db } from '../lib/db';

const PaymentWindow = ({ isOpen, onClose, amount, description, title = "Apoya nuestra misión" }) => {
    const [config, setConfig] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        if (isOpen) {
            db.getConfig().then(setConfig);
        }
    }, [isOpen]);

    const handleCopy = (text, fieldId) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!isOpen) return null;

    const payments = config?.payments || {};

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-deep-space-black border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-cyan/10 text-electric-cyan mb-4">
                            {amount ? <CreditCard size={32} /> : <Heart size={32} />}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                        {description && <p className="text-gray-400 mb-2">{description}</p>}
                        {amount && (
                            <div className="text-3xl font-bold text-starlight-gold mt-2">
                                ${amount} <span className="text-sm text-gray-400">USD/ARS</span>
                            </div>
                        )}
                        {!amount && (
                            <p className="text-gray-400 text-sm">
                                Tu aporte nos ayuda a seguir divulgando la ciencia y organizando expediciones.
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* PayPal */}
                        {payments.paypal?.enabled && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                                </div>
                                <p className="text-gray-400 text-sm mb-3">Envía tu pago a nuestro correo oficial:</p>
                                <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5 group">
                                    <span className="text-white font-mono text-sm truncate mr-2">{payments.paypal?.email || 'No configurado'}</span>
                                    <button
                                        onClick={() => handleCopy(payments.paypal?.email, 'paypal')}
                                        className="text-gray-400 hover:text-electric-cyan transition-colors"
                                    >
                                        {copiedField === 'paypal' ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mercado Pago */}
                        {payments.mercadopago?.enabled && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="font-bold text-white">Mercado Pago</span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">CVU / CVU</p>
                                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5">
                                            <span className="text-white font-mono text-sm truncate mr-2">{payments.mercadopago?.cvu || 'No configurado'}</span>
                                            <button
                                                onClick={() => handleCopy(payments.mercadopago?.cvu, 'mp_cvu')}
                                                className="text-gray-400 hover:text-electric-cyan transition-colors"
                                            >
                                                {copiedField === 'mp_cvu' ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Alias</p>
                                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5">
                                            <span className="text-electric-cyan font-bold font-mono text-sm truncate mr-2">{payments.mercadopago?.alias || 'No configurado'}</span>
                                            <button
                                                onClick={() => handleCopy(payments.mercadopago?.alias, 'mp_alias')}
                                                className="text-gray-400 hover:text-electric-cyan transition-colors"
                                            >
                                                {copiedField === 'mp_alias' ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cuenta DNI / Transferencia */}
                        {payments.cuentadni?.enabled && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="font-bold text-green-400">Cuenta DNI / Bancaria</span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">CBU / CVU</p>
                                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5">
                                            <span className="text-white font-mono text-sm truncate mr-2">{payments.cuentadni?.cbu || 'No configurado'}</span>
                                            <button
                                                onClick={() => handleCopy(payments.cuentadni?.cbu, 'dni_cbu')}
                                                className="text-gray-400 hover:text-electric-cyan transition-colors"
                                            >
                                                {copiedField === 'dni_cbu' ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Alias</p>
                                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5">
                                            <span className="text-green-400 font-bold font-mono text-sm truncate mr-2">{payments.cuentadni?.alias || 'No configurado'}</span>
                                            <button
                                                onClick={() => handleCopy(payments.cuentadni?.alias, 'dni_alias')}
                                                className="text-gray-400 hover:text-electric-cyan transition-colors"
                                            >
                                                {copiedField === 'dni_alias' ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <p className="text-xs text-gray-500">
                                Una vez realizado el pago, por favor envía el comprobante a nuestro <a href={`mailto:${config?.contact?.email}`} className="text-electric-cyan hover:underline">email</a> o WhatsApp.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentWindow;
