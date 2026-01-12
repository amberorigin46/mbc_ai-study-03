
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, RecipeResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateRecipes = async (ingredients: string[], mealTime: MealTime): Promise<RecipeResponse> => {
  const prompt = `냉장고에 있는 재료들: ${ingredients.join(", ")}. 식사 시간: ${mealTime}. 
  이 재료들을 주로 활용하여 ${mealTime}에 어울리는 요리 레시피 3가지를 제안해줘. 
  만약 부족한 필수 재료(소금, 기름 등 기본 양념 제외)가 있다면 최소한으로 포함해도 괜찮아. 
  한국어로 답변해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "요리 이름" },
                  description: { type: Type.STRING, description: "요리에 대한 짧은 설명" },
                  ingredients: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "필요한 재료 리스트"
                  },
                  instructions: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "조리 순서 단계별 리스트"
                  },
                  cookingTime: { type: Type.STRING, description: "예상 조리 시간 (예: 20분)" },
                  difficulty: { type: Type.STRING, description: "난이도 (쉬움, 보통, 어려움 중 선택)" }
                },
                required: ["name", "description", "ingredients", "instructions", "cookingTime", "difficulty"]
              }
            }
          },
          required: ["recipes"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as RecipeResponse;
  } catch (error) {
    console.error("Recipe generation failed:", error);
    throw error;
  }
};
