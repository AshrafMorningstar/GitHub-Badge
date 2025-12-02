import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const streamBadgeAdvice = async (
  prompt: string,
  useThinking: boolean,
  onChunk: (text: string) => void
) => {
  try {
    const modelId = useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';
    
    const config: any = {
      systemInstruction: `You are a GitHub Profile Achievement Expert. 
      Your goal is to help developers understand, earn, and strategize about GitHub Badges.
      You have deep knowledge of all badges (Starstruck, Pull Shark, etc.) and how to troubleshoot missing ones.
      Be encouraging, concise, and technically accurate.
      If asked about "strategy", focus on how to contribute meaningfully to open source to earn badges naturally.
      Refer to badges by their official names.`,
    };

    // Apply specific configs based on model
    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    } 

    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
      config: config
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("\n\n*Error: Unable to reach the Badge Advisor. Please check your connection or try again later.*");
  }
};