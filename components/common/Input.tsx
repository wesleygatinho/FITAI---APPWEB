
import React from 'react';
import { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', type="text", ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        id={id || props.name}
        type={type}
        className={`block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-100 ${className}
                    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
    