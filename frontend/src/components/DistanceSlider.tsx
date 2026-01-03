import React from 'react';
import { Language } from '../types';

interface DistanceSliderProps {
  distance: number;
  onChange: (distance: number) => void;
  language: Language;
  min?: number;
  max?: number;
  className?: string;
}

export const DistanceSlider: React.FC<DistanceSliderProps> = ({
  distance,
  onChange,
  language,
  min = 1,
  max = 50,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className={`text-sm font-medium text-gray-700 ${language === 'hi' ? 'font-hindi' : ''}`}>
          {language === 'hi' ? 'दूरी सीमा' : 'Distance Range'}
        </label>
        <span className="text-sm font-bold text-primary-600">
          {distance} {language === 'hi' ? 'किमी' : 'km'}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={distance}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((distance - min) / (max - min)) * 100}%, #e5e7eb ${((distance - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min} {language === 'hi' ? 'किमी' : 'km'}</span>
          <span>{max} {language === 'hi' ? 'किमी' : 'km'}</span>
        </div>
      </div>
    </div>
  );
};
