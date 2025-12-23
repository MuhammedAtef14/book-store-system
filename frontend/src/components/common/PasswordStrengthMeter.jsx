import React from 'react';
import { getPasswordStrength, getPasswordRequirements } from '../../utils/validation';

export default function PasswordStrengthMeter({ password }) {
  const strength = getPasswordStrength(password);
  const requirements = getPasswordRequirements(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded ${
              i < strength.strength ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength.strength <= 2 ? 'text-red-600' :
        strength.strength <= 3 ? 'text-yellow-600' :
        strength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
      }`}>
        Password strength: {strength.label}
      </p>
      <div className="text-xs text-gray-600 space-y-1">
        <p className="font-medium">Password must contain:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${req.met ? 'text-green-600' : 'text-gray-500'}`}
            >
              <span>{req.met ? '✓' : '○'}</span>
              {req.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}