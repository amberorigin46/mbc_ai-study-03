
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-800 leading-tight">{recipe.name}</h3>
        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
          recipe.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
          recipe.difficulty === '보통' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {recipe.difficulty}
        </span>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 flex-grow">{recipe.description}</p>
      
      <div className="flex items-center gap-4 mb-6 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          ⏱️ {recipe.cookingTime}
        </span>
        <span className="flex items-center gap-1">
          🥕 {recipe.ingredients.length}개 재료
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">필요 재료</h4>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.map((ing, i) => (
              <span key={i} className="text-xs bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-100">
                {ing}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">조리 방법</h4>
          <ol className="text-sm text-slate-700 space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold text-emerald-500 shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
