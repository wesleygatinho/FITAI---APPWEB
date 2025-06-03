
import React from 'react';
import { SelectProps } from '../../types';

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <select
        id={id || props.name}
        className={`block w-full pl-3 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                    focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-100 ${className}
                    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-700 text-gray-100">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
    