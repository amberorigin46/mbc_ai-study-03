
import React, { useState, useCallback } from 'react';
import { MealTime, Recipe } from './types';
import MealTimeSelector from './components/MealTimeSelector';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import { generateRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [mealTime, setMealTime] = useState<MealTime>(MealTime.LUNCH);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = (item: string) => {
    if (!ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      alert('최소 하나 이상의 재료를 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateRecipes(ingredients, mealTime);
      setRecipes(result.recipes);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('레시피를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <h1 className="text-xl font-bold text-slate-800">ChefInBox</h1>
          </div>
          <p className="text-sm text-slate-500 hidden sm:block">스마트한 냉장고 파먹기의 시작</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            지금 <span className="text-emerald-600">냉장고</span>에 무엇이 있나요?
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            있는 재료로 최고의 한 끼를 만들어보세요. 시간과 상황에 꼭 맞는 <br className="hidden sm:block" /> 3가지 특별한 레시피를 제안해 드립니다.
          </p>
        </section>

        {/* Input Configuration */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto mb-16">
          <div className="mb-10 text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
              <span className="text-emerald-500">Step 1.</span> 식사 시간 선택
            </h3>
            <MealTimeSelector selected={mealTime} onSelect={setMealTime} />
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
              <span className="text-emerald-500">Step 2.</span> 보유 재료 입력
            </h3>
            <IngredientInput 
              ingredients={ingredients} 
              onAdd={addIngredient} 
              onRemove={removeIngredient} 
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`group relative w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-slate-300 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  쉐프가 고민 중...
                </span>
              ) : (
                '레시피 3가지 추천받기'
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-10 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Results Section */}
        {recipes.length > 0 && (
          <section id="results-section" className="scroll-mt-24 pt-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 flex-grow"></div>
              <h2 className="text-2xl font-black text-slate-800 shrink-0">✨ 추천 레시피 ✨</h2>
              <div className="h-px bg-slate-200 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <div key={index} className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${index * 0.2}s` }}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
