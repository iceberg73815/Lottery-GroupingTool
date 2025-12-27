
import { GoogleGenAI, Type } from "@google/genai";

// 获取 API Key (支持多种环境变量格式)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).API_KEY || (process.env as any).GEMINI_API_KEY;

// 只在有 API Key 时初始化
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.warn('Failed to initialize Gemini API:', error);
  }
}

export const generateTeamNames = async (count: number, theme: string = "cool"): Promise<string[]> => {
  // 如果没有初始化 API，返回默认队名
  if (!ai) {
    console.info('Gemini API 未配置，使用默认队名');
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }

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
  // 如果没有初始化 API，返回默认祝贺语
  if (!ai) {
    return `太棒了，${name}！你是今天的幸运儿！`;
  }

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
