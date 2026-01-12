
import React, { useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  onAdd: (ingredient: string) => void;
  onRemove: (index: number) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <label className="block text-sm font-semibold text-slate-700 mb-2">냉장고 속 재료 입력</label>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예: 김치, 계란, 양파 (입력 후 Enter)"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
        <button
          onClick={handleAddClick}
          className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          추가
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ingredients.length === 0 && (
          <p className="text-slate-400 text-sm italic">재료를 추가하여 레시피를 만들어보세요!</p>
        )}
        {ingredients.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200"
          >
            {item}
            <button
              onClick={() => onRemove(idx)}
              className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;
