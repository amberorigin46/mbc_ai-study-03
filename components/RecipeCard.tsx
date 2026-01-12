
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full group">
      {/* Image Area */}
      <div className="relative h-56 bg-slate-200 overflow-hidden">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-12 h-12 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
            recipe.difficulty === '쉬움' ? 'bg-green-500/90 text-white' :
            recipe.difficulty === '보통' ? 'bg-orange-500/90 text-white' :
            'bg-red-500/90 text-white'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2">{recipe.name}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{recipe.description}</p>
        </div>
        
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-400 font-bold tracking-widest uppercase">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
            ⏱️ {recipe.cookingTime}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
            🥕 {recipe.ingredients.length} Ingredients
          </span>
        </div>

        {/* Decoration Tips Section */}
        <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">✨</span>
            <h4 className="text-sm font-bold text-emerald-800">쉐프의 데코레이션 팁</h4>
          </div>
          <p className="text-sm text-emerald-700 leading-relaxed italic">
            "{recipe.decorationTips}"
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">준비 재료</h4>
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.map((ing, i) => (
                <span key={i} className="text-xs font-medium bg-slate-50 px-2.5 py-1.5 rounded-lg text-slate-600 border border-slate-100">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">조리 순서</h4>
            <ol className="text-sm text-slate-700 space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-900 text-white text-[10px] font-bold rounded-full shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
