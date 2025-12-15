import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGeminiAssistant = async (prompt: string, context: string): Promise<string> => {
  try {
    const fullPrompt = `
      Ты — умный помощник администратора видеостудии и продакшена.
      Твоя цель — помогать с выбором техники, разрешением конфликтов расписания и генерацией идей для мероприятий.
      
      Контекст текущих данных (инвентарь/правила):
      ${context}
      
      Запрос пользователя:
      ${prompt}
      
      Ответь кратко, профессионально и по делу (на русском языке). Используй markdown для форматирования.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "Извините, я не смог сформировать ответ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Произошла ошибка при обращении к ИИ помощнику.";
  }
};