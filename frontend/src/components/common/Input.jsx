import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({ 
  icon: Icon, 
  error, 
  label,
  required,
  ...props 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${props.className || ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-start gap-1">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}