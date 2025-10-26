import { GoogleGenAI } from "@google/genai";

// Fix: Per Gemini API guidelines, API key is expected to be available in `process.env.API_KEY`.
// The conditional check and fallback have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateBookingSummary(serviceName: string, categoryName: string): Promise<string> {
  try {
    const prompt = `Generate a friendly and appealing one-paragraph summary for a booking of the "${serviceName}" service from the "${categoryName}" category. Mention the benefits, what the customer can expect in a welcoming tone, and end with an encouraging sentence about looking forward to providing the service.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating booking summary:", error);
    return "Our expert will ensure you receive top-quality service, leaving you satisfied and your home sparkling. We look forward to serving you!";
  }
}
