
import { GoogleGenAI } from "@google/genai";

// 브라우저 환경에서 에러 방지를 위한 안전한 API 키 참조
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || "";
  } catch {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateQuestIdea = async (friendName: string, birthdayPersonName: string) => {
  if (!getApiKey()) {
    console.warn("API Key is missing. Quest generation will not work.");
    return [];
  }
  
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

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating quest idea:", error);
    return [];
  }
};
