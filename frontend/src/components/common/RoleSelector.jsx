import React from 'react';
import { User, Shield, AlertCircle } from 'lucide-react';

export default function RoleSelector({ selectedRole, onRoleChange, error }) {
  const roles = [
    {
      value: 'CUSTOMER',
      label: 'Customer',
      icon: User,
      description: 'Browse and purchase books',
      color: 'blue'
    },
    {
      value: 'ADMIN',
      label: 'Admin',
      icon: Shield,
      description: 'Manage bookstore operations',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Account Type *</label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;
          
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onRoleChange(role.value)}
              className={`p-4 border-2 rounded-lg transition-all ${
                isSelected
                  ? role.color === 'blue' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${error ? 'border-red-500' : ''}`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected 
                    ? role.color === 'blue' 
                      ? 'bg-blue-100' 
                      : 'bg-purple-100'
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected 
                      ? role.color === 'blue' 
                        ? 'text-blue-600' 
                        : 'text-purple-600'
                      : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className={`font-semibold ${
                    isSelected 
                      ? role.color === 'blue' 
                        ? 'text-blue-700' 
                        : 'text-purple-700'
                      : 'text-gray-700'
                  }`}>
                    {role.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-start gap-1">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}