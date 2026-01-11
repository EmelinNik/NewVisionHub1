import { GoogleGenAI } from "@google/genai";

// Fix: Removed top-level initialization to comply with guidelines of creating the instance right before usage.

export const askGeminiAssistant = async (prompt: string, context: string): Promise<string> => {
  try {
    // Fix: Initializing GoogleGenAI inside the function to ensure up-to-date API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const fullPrompt = `
      Ты — умный помощник администратора видеостудии и продакшена.
      Твоя цель — помогать с выбором техники, разрешением конфликтов расписания и генерацией идей для мероприятий.
      
      Контекст текущих данных (инвентарь/правила):
      ${context}
      
      Запрос пользователя:
      ${prompt}
      
      Ответь кратко, профессионально и по делу (на русском языке). Используй markdown для форматирования.
    `;

    // Fix: Using correct model 'gemini-3-flash-preview' for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });

    // Fix: Accessing .text as a property, not a method.
    return response.text || "Извините, я не смог сформировать ответ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Произошла ошибка при обращении к ИИ помощнику.";
  }
};