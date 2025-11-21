import { GoogleGenAI, Type } from "@google/genai";
import { RouteOption, TransportMode } from '../types';

export const fetchRoutes = async (origin: string, destination: string): Promise<RouteOption[]> => {
  // 1. 安全檢查：確認 API Key 是否存在
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("未配置 API Key。請在 Vercel Settings 中設置環境變量 'API_KEY'。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `請以香港本地人的習慣，為我規劃 3 條從 "${origin}" 到 "${destination}" 的公共交通路線。
  
  要求：
  1. 請提供實際的預計時間和車費（港幣）。
  2. 包含港鐵 (MTR)、巴士 (Bus)、電車 (Tram)、渡輪 (Ferry) 或小巴等常見交通工具。
  3. 針對公共交通步驟，請根據班次頻率估算一個"等待時間" (waitMinutes)。
  4. locationName 必須是具體的站名或地點（例如："中環站 A 出口"、"彌敦道巴士站"）。
  5. **所有輸出的文字內容（instruction, summary, locationName 等）必須使用繁體中文（Traditional Chinese），並符合香港用語習慣。**
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              summary: { type: Type.STRING, description: "路線摘要，例如 '港鐵 -> 巴士 5號'" },
              totalDuration: { type: Type.STRING, description: "例如 '45 分鐘'" },
              cost: { type: Type.STRING, description: "例如 'HK$ 12.5'" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "標籤，例如 '最快'、'最平'、'少步行'"
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mode: {
                      type: Type.STRING,
                      enum: [
                        TransportMode.WALK,
                        TransportMode.SUBWAY,
                        TransportMode.BUS,
                        TransportMode.TRAM,
                        TransportMode.FERRY,
                        TransportMode.TAXI
                      ]
                    },
                    instruction: { type: Type.STRING, description: "用戶該做什麼，繁體中文" },
                    duration: { type: Type.STRING, description: "步驟所需時間" },
                    locationName: { type: Type.STRING, description: "車站或地點名稱，用於地圖搜索" },
                    lineName: { type: Type.STRING, description: "路線號碼或線路名稱" },
                    waitMinutes: { type: Type.INTEGER, description: "預計下一班車的等待分鐘數 (模擬值)" }
                  },
                  required: ["mode", "instruction", "duration", "locationName"]
                }
              }
            },
            required: ["id", "summary", "totalDuration", "cost", "steps", "tags"]
          }
        }
      }
    });

    let text = response.text;
    if (!text) {
      throw new Error("AI 未返回任何內容");
    }

    // 2. 數據清洗：移除可能的 Markdown 標記 (```json ... ```)，防止解析失敗
    text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    try {
      return JSON.parse(text) as RouteOption[];
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError, "Raw text:", text);
      throw new Error("AI 返回數據格式錯誤，請重試。");
    }

  } catch (e: any) {
    console.error("Gemini API Error:", e);
    
    const errorMsg = e.toString();

    // 3. 錯誤翻譯：提供用戶可讀的錯誤信息
    if (errorMsg.includes('403') || errorMsg.includes('API_KEY')) {
      throw new Error("API Key 無效或權限不足。請檢查 Vercel 環境變量設置。");
    }
    if (errorMsg.includes('429')) {
      throw new Error("請求過多 (429)，系統繁忙，請稍後再試。");
    }
    if (errorMsg.includes('503')) {
      throw new Error("AI 服務暫時不可用，請稍後再試。");
    }
    if (errorMsg.includes('Failed to fetch')) {
      throw new Error("網絡錯誤：無法連接到 AI 服務。請檢查網絡連接。");
    }

    throw new Error(`查詢失敗: ${e.message || "未知錯誤"}`);
  }
};