import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-right">
      {label && (
        <label htmlFor={id} className="text-[#1e3a8a] font-bold text-sm select-none">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-700 bg-white/70 backdrop-blur-sm text-right placeholder-slate-400 focus:outline-none transition-all duration-200 ${
            isPassword ? 'ps-12' : ''
          } ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/30'
          } ${className}`}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Eye className="w-5 h-5" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-xs font-semibold mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};