import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  loading, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  children, 
  icon: Icon,
  ...props 
}) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${fullWidth ? 'w-full' : ''} ${sizes[size]} rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-semibold ${variants[variant]} ${props.className || ''}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </button>
  );
}