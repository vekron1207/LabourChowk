import React from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../utils/constants';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {Object.entries(LANGUAGES).map(([code, name]) => {
        const isActive = currentLanguage === code;
        return (
          <button
            key={code}
            onClick={() => onLanguageChange(code as Language)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
              ${code === 'hi' ? 'font-hindi' : ''}
            `.trim()}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
