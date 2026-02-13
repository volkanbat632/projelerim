
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

// Fixed: Initialized GoogleGenAI strictly using process.env.API_KEY as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (transactions: Transaction[]) => {
  const prompt = `Aşağıdaki finansal işlemlerimi analiz et ve bana Türkçe dilinde tasarruf önerileri, harcama alışkanlıklarım hakkında bilgi ve finansal iyileştirme ipuçları ver.
  İşlemler: ${JSON.stringify(transactions)}`;

  // Fixed: Use gemini-3-pro-preview for complex reasoning and financial tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
      systemInstruction: "Sen profesyonel bir finans danışmanısın. Kullanıcının harcamalarını analiz edip akıllıca tavsiyeler verirsin."
    }
  });

  return response.text;
};

export const getMarketAnalysis = async (query: string) => {
  // Fixed: Use gemini-3-pro-preview for advanced reasoning tasks like market analysis
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const parseVoiceTransaction = async (voiceText: string) => {
  const prompt = `Aşağıdaki sesli komutu bir gelir veya gider işlemine dönüştür: "${voiceText}"`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: 'income or expense' },
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          description: { type: Type.STRING },
          date: { type: Type.STRING, description: 'YYYY-MM-DD format' }
        },
        required: ['type', 'category', 'amount']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return null;
  }
};
