
import { GoogleGenAI } from "@google/genai";

// Fix: Always obtain the API key directly from process.env.API_KEY and initialize GoogleGenAI per call
export const generateQuestIdea = async (friendName: string, birthdayPersonName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `생일 주인공인 '${birthdayPersonName}'를 위해 친구 '${friendName}'가 제안할 수 있는 아주 유쾌하고 조금은 엉뚱한 생일 미션(퀘스트) 3가지를 추천해줘. 
      조건: 
      1. 한국어로 답변할 것.
      2. 미션은 일상에서 할 수 있는 재미있는 활동이어야 함.
      3. 웃긴 에피소드가 만들어질 법한 것이어야 함.
      4. JSON 형식으로 줄 것. [{ "title": "...", "description": "..." }]`,
      config: {
        responseMimeType: "application/json"
      }
    });

    // Fix: Access response.text property directly as per latest SDK guidelines
    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (error) {
    console.error("Error generating quest idea:", error);
    return [];
  }
};
