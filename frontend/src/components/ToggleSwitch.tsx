import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  label?: string;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onToggle,
  label,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && <span className="text-base font-medium text-gray-700">{label}</span>}
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={`
          relative inline-flex h-8 w-14 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${enabled ? 'bg-primary-600' : 'bg-gray-300'}
        `.trim()}
      >
        <span
          className={`
            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-7' : 'translate-x-1'}
          `.trim()}
        />
      </button>
    </div>
  );
};
