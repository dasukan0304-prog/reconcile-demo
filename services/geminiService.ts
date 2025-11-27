import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, Source } from "../types";

// Fix TS2591: Declare process variable for environment
declare const process: {
  env: {
    API_KEY: string;
  };
};

// Access environment variable using process.env.API_KEY as per guidelines
const apiKey = process.env.API_KEY;

// Initialize GoogleGenAI client with the API key
// Assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION = `
You are an expert financial analyst specializing in the Gold market (XAU/USD) and Thai Gold Bar (96.5%). 
Your audience is Thai investors. 
You provide concise, actionable advice based on real-time data.
Your output style should be professional, easy to read, and formatted in Markdown.
Always start your response with a clear header indicating the 'Verdict' (e.g., RECOMMENDATION: BUY, RECOMMENDATION: SELL, or RECOMMENDATION: WAIT).
Then provide the 'Current Price' details found in search.
Then provide 'Key Drivers' (reasons).
Then provide a 'Summary'.
`;

export const analyzeGoldMarket = async (): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = "วิเคราะห์ราคาทองคำวันนี้ (Spot Gold และ ทองคำแท่งไทย). ราคาเท่าไหร่? แนวโน้มขึ้นหรือลง? ปัจจัยข่าวเศรษฐกิจโลกคืออะไร? สรุปว่า 'ควรซื้อวันนี้เลยหรือไม่'";

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        // Note: We cannot use responseMimeType: 'application/json' with googleSearch
      },
    });

    const text = response.text || "ไม่สามารถดึงข้อมูลได้ในขณะนี้";
    
    // Extract sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = chunks
      .map((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          return {
            title: chunk.web.title,
            url: chunk.web.uri,
          };
        }
        return null;
      })
      .filter((s): s is Source => s !== null);

    // Basic heuristic sentiment analysis based on the text content
    let sentiment: AnalysisResult['sentiment'] = 'NEUTRAL';
    if (text.match(/RECOMMENDATION:\s*BUY/i) || text.includes("แนะนำ: ซื้อ") || text.includes("ควรซื้อ")) {
      sentiment = 'BUY';
    } else if (text.match(/RECOMMENDATION:\s*SELL/i) || text.includes("แนะนำ: ขาย")) {
      sentiment = 'SELL';
    } else if (text.match(/RECOMMENDATION:\s*WAIT/i) || text.includes("แนะนำ: ชะลอ") || text.includes("รอดูก่อน")) {
      sentiment = 'WAIT';
    }

    return {
      markdownContent: text,
      sources: sources,
      sentiment,
      timestamp: new Date().toLocaleTimeString('th-TH'),
    };

  } catch (error) {
    console.error("Error analyzing gold market:", error);
    throw error;
  }
};

export const sendFollowUpMessage = async (history: string[], message: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        
        // Fix TS6133: Use history to provide context
        const historyContext = history.length > 0 
            ? `\n\nPrevious conversation context:\n${history.join('\n')}` 
            : "";

        // Construct a simple context from history for the stateless generateContent (or could use chats)
        // Using chat session is better for conversation
        const chat = ai.chats.create({
            model: model,
            config: {
                // Append history to system instruction
                systemInstruction: SYSTEM_INSTRUCTION + historyContext,
                tools: [{ googleSearch: {} }],
            }
        });
        
        // Seed history if needed, but for simplicity in this demo, we'll just send the current message 
        // assuming the user context is implied or we are starting fresh topic. 
        // To do it properly with history, we'd map history to the Content format.
        // For this implementation, we will treat it as a fresh query but framed as a follow-up.
        
        const response = await chat.sendMessage({ message: message });
        return response.text || "ขออภัย เกิดข้อผิดพลาดในการประมวลผล";
    } catch (error) {
        console.error("Chat error:", error);
        return "ขออภัย ระบบขัดข้องชั่วคราว";
    }
}