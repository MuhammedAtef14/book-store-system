import React from 'react';

export default function Card({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  ...props 
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="p-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}