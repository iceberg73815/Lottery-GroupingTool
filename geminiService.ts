
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTeamNames = async (count: number, theme: string = "cool"): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} creative and funny team names for a company event. The theme is: ${theme}. Return as a JSON list of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};

export const generateWinnerCongratulation = async (name: string, vibe: string = "enthusiastic and funny"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short congratulatory message for ${name} who just won a prize at a company raffle. 
      The tone/vibe should be: ${vibe}. 
      Max 15 words. Respond in the same language as the vibe provided if it's Chinese, otherwise English.`,
    });
    return response.text?.trim() || `恭喜你，${name}！`;
  } catch (error) {
    return `太棒了，${name}！你是今天的幸运儿！`;
  }
};
