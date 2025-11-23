import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateWeddingTasks = async (timeframe: string): Promise<Partial<Task>[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate a list of 5 essential wedding planning tasks for a couple who are ${timeframe} away from their wedding. Focus on practical, high-priority items.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short title of the task" },
              description: { type: Type.STRING, description: "Brief explanation of what needs to be done" },
              category: { type: Type.STRING, enum: ['Planning', 'Ceremony', 'Reception', 'Other'] }
            },
            required: ["title", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error generating tasks:", error);
    return [];
  }
};

export const generateVows = async (tone: string, keyMemories: string, partnerName: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write wedding vows for my partner ${partnerName}. 
    Tone: ${tone}. 
    Key memories/traits to include: ${keyMemories}. 
    Keep it under 200 words and make it emotional but structured.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Could not generate vows at this time.";
  } catch (error) {
    console.error("Error generating vows:", error);
    return "An error occurred while generating vows.";
  }
};

export const generateThankYouNote = async (guestName: string, gift: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, sincere thank you note for a wedding guest named ${guestName} who gave a gift of: ${gift}.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Could not generate note.";
  } catch (error) {
    console.error("Error generating thank you note:", error);
    return "Error generating note.";
  }
};