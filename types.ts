
export enum MealTime {
  BREAKFAST = '아침',
  LUNCH = '점심',
  DINNER = '저녁'
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: '쉬움' | '보통' | '어려움';
  decorationTips: string;
  imageUrl?: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
}
