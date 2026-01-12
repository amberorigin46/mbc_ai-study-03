
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, RecipeResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateRecipes = async (ingredients: string[], mealTime: MealTime): Promise<RecipeResponse> => {
  const prompt = `냉장고에 있는 재료들: ${ingredients.join(", ")}. 식사 시간: ${mealTime}. 
  이 재료들을 주로 활용하여 ${mealTime}에 어울리는 요리 레시피 3가지를 제안해줘. 
  각 요리에 대해 'decorationTips' 필드에는 음식을 더 맛있게 보이게 하는 플레이팅 방법이나 가니쉬(고명) 추천을 포함해줘.
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
                  cookingTime: { type: Type.STRING, description: "예상 조리 시간" },
                  difficulty: { type: Type.STRING, description: "난이도 (쉬움, 보통, 어려움)" },
                  decorationTips: { type: Type.STRING, description: "음식 데코레이션 및 플레이팅 팁" }
                },
                required: ["name", "description", "ingredients", "instructions", "cookingTime", "difficulty", "decorationTips"]
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

export const generateRecipeImage = async (recipeName: string, description: string): Promise<string | undefined> => {
  try {
    const prompt = `A professional, high-resolution food photography shot of ${recipeName}. ${description}. The dish is elegantly plated on a modern ceramic plate, soft natural lighting, gourmet restaurant style, focus on the texture of the food.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed for:", recipeName, error);
    return undefined;
  }
};
