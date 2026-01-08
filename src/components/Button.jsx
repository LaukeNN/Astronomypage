import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-starlight-gold text-deep-space-black hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(244,208,111,0.5)]",
        outline: "border-2 border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]",
        ghost: "text-gray-300 hover:text-white hover:bg-white/5"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
