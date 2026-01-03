import React from 'react';
import { SkillKey, Language } from '../types';
import { SKILLS } from '../utils/constants';

interface SkillSelectorProps {
  selectedSkills: SkillKey[];
  onToggle: (skill: SkillKey) => void;
  language: Language;
  multiple?: boolean;
  className?: string;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  selectedSkills,
  onToggle,
  language,
  multiple = true,
  className = '',
}) => {
  const handleSkillClick = (skillKey: SkillKey) => {
    if (!multiple && selectedSkills.includes(skillKey)) {
      return;
    }
    onToggle(skillKey);
  };

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {SKILLS.map((skill) => {
        const isSelected = selectedSkills.includes(skill.key);
        return (
          <button
            key={skill.key}
            type="button"
            onClick={() => handleSkillClick(skill.key)}
            className={`
              flex flex-col items-center justify-center
              p-4 rounded-lg border-2 transition-all duration-200
              ${
                isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-primary-300'
              }
            `.trim()}
          >
            <span className="text-3xl mb-2">{skill.icon}</span>
            <span className={`text-sm font-medium ${language === 'hi' ? 'font-hindi' : ''}`}>
              {language === 'hi' ? skill.nameHi : skill.nameEn}
            </span>
          </button>
        );
      })}
    </div>
  );
};
