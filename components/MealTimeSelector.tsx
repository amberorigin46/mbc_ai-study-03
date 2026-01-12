
import React from 'react';
import { MealTime } from '../types';

interface MealTimeSelectorProps {
  selected: MealTime;
  onSelect: (time: MealTime) => void;
}

const MealTimeSelector: React.FC<MealTimeSelectorProps> = ({ selected, onSelect }) => {
  const options = [
    { value: MealTime.BREAKFAST, icon: '🌅', label: '아침' },
    { value: MealTime.LUNCH, icon: '☀️', label: '점심' },
    { value: MealTime.DINNER, icon: '🌙', label: '저녁' },
  ];

  return (
    <div className="flex gap-2 w-full max-w-md mx-auto mb-8">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 border-2 ${
            selected === opt.value
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-105'
              : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'
          }`}
        >
          <span className="text-2xl mb-1">{opt.icon}</span>
          <span className="font-bold">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MealTimeSelector;
