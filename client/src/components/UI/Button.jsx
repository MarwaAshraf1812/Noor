import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  className = '',
  href = '',
  to = '',
  ...props
}) {
  const baseStyle = "px-6 py-2.5 rounded-2xl font-bold text-base transition-all duration-200 inline-flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#3b82f6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10 focus:ring-blue-500",
    secondary: "bg-[#f59e0b] hover:bg-amber-600 text-white shadow-md shadow-amber-500/10 focus:ring-amber-500",
    outline: "border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 bg-white/50 focus:ring-slate-400"
  };

  const selectedVariant = variants[variant] || variants.primary;
  const combinedClasses = `${baseStyle} ${selectedVariant} ${className}`;

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.05 },
    whileTap: disabled ? {} : { scale: 0.95 },
    ...props
  };

  if (to && !disabled) {
    return (
      <MotionLink to={to} className={combinedClasses} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  if (href && !disabled) {
    return (
      <motion.a href={href} className={combinedClasses} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}