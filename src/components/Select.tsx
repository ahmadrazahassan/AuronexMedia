import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = false,
  options,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-3 border-2 rounded-card font-sf-pro text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';
  const errorStyles = error ? 'border-red-500' : 'border-gray-300';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <div className={widthStyles}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2 font-sf-pro">
          {label}
        </label>
      )}
      <select
        className={`${baseStyles} ${errorStyles} ${widthStyles} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-sf-pro">{error}</p>
      )}
    </div>
  );
};
