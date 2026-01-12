
import React, { useState } from 'react';
import { MealTime, Recipe } from './types';
import MealTimeSelector from './components/MealTimeSelector';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import { generateRecipes, generateRecipeImage } from './services/geminiService';

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
    setRecipes([]); // Reset previous results

    try {
      // 1. Generate text recipes first
      const result = await generateRecipes(ingredients, mealTime);
      setRecipes(result.recipes);

      // Smooth scroll to results immediately after text is ready
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // 2. Generate images for each recipe in parallel
      const recipesWithImages = await Promise.all(
        result.recipes.map(async (recipe) => {
          const imageUrl = await generateRecipeImage(recipe.name, recipe.description);
          return { ...recipe, imageUrl };
        })
      );

      setRecipes(recipesWithImages);
    } catch (err) {
      setError('레시피를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">ChefInBox</h1>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden md:block">Smart Kitchen Assistant</p>
            <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">My Kitchen</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-20">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
            AI-Powered Culinary Guide
          </div>
          <h2 className="text-5xl md:text-7xl font-[900] text-slate-900 mb-8 tracking-tighter leading-[1.1]">
            냉장고를 여는 순간,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">당신은 최고의 쉐프</span>가 됩니다.
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            버려지는 재료 없이, 가장 맛있는 순간을 위해.<br />
            오늘의 식사 시간을 선택하고 가지고 계신 재료를 입력해주세요.
          </p>
        </section>

        {/* Configuration Section */}
        <div className="max-w-4xl mx-auto space-y-8 mb-24">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="mb-14">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 font-black rounded-2xl text-lg">01</span>
                  <h3 className="text-2xl font-black text-slate-800">언제 드실 건가요?</h3>
                </div>
                <MealTimeSelector selected={mealTime} onSelect={setMealTime} />
              </div>

              <div className="mb-14">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 font-black rounded-2xl text-lg">02</span>
                  <h3 className="text-2xl font-black text-slate-800">재료를 모두 알려주세요</h3>
                </div>
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
                  className="w-full sm:w-auto px-16 py-6 bg-slate-900 text-white font-black text-2xl rounded-[2rem] shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-4 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      레시피와 사진 생성 중...
                    </>
                  ) : (
                    '지금 요리 제안받기'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="max-w-4xl mx-auto mb-16 p-6 bg-red-50 text-red-800 rounded-3xl border border-red-100 flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {recipes.length > 0 && (
          <section id="results-section" className="scroll-mt-32 pb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-2">당신만을 위한 오늘의 제안</h2>
              <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {recipes.map((recipe, index) => (
                <div 
                  key={index} 
                  className="opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]" 
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-[10px]">C</div>
            <span className="font-bold text-slate-800">ChefInBox</span>
          </div>
          <p className="text-slate-400 text-sm italic">Designed for the ultimate home cooking experience.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-emerald-600">Privacy</a>
            <a href="#" className="hover:text-emerald-600">Terms</a>
            <a href="#" className="hover:text-emerald-600">Help</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
