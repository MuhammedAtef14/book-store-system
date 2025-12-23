import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div className={`flex items-center justify-between gap-2 p-3 rounded-lg border ${styles[type]}`}>
      <div className="flex items-center gap-2">
        {icons[type]}
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}