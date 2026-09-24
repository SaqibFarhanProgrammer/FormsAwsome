import { GoogleGenAI } from "@google/genai";
import { AppError } from "@/lib/auth/appError";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function geminiai(query: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("GEMINI_API_KEY is not configured", 500);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: query,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini service error:", error);

    throw new AppError("AI service failed", 500);
  }
}
