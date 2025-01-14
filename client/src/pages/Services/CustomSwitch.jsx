import React from 'react';
import { Check, X } from 'lucide-react';

const CustomSwitch = ({ checked, onCheckedChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-10 items-center rounded-full transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-blue-500
        ${checked ? 'bg-green-500' : 'bg-red-500'}
      `}
    >
      <span className="sr-only">Toggle status</span>
      <span
        className={`
          inline-flex h-5 w-5 transform items-center justify-center rounded-full
          bg-white shadow-lg ring-0 transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      >
        {checked ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <X className="h-3 w-3 text-red-500" />
        )}
      </span>
    </button>
  );
};

export default CustomSwitch;
