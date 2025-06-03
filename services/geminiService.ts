
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_API_KEY_WARNING, GEMINI_MODEL_TEXT } from "../constants";
import { GroundingMetadata } from "../types";


const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(GEMINI_API_KEY_WARNING);
}

export const generateFitnessTip = async (): Promise<string | null> => {
  if (!ai) return "A funcionalidade de IA está desabilitada devido à falta da chave da API.";
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: "Dê uma dica rápida de fitness ou bem-estar em uma frase concisa e motivadora."
    });
    return response.text;
  } catch (error) {
    console.error("Error generating fitness tip:", error);
    return "Não foi possível gerar uma dica no momento. Tente novamente mais tarde.";
  }
};

export const generateWorkoutIdea = async (prompt: string): Promise<{text: string, groundingMetadata?: GroundingMetadata } | null> => {
  if (!ai) return { text: "A funcionalidade de IA está desabilitada devido à falta da chave da API."};

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
          // Omitting thinkingConfig for general tasks as per guidelines
        }
    });
    
    // Type assertion for groundingMetadata if needed, assuming it might be present.
    // The actual structure of candidates and groundingMetadata should be checked against API docs.
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

    return { text: response.text, groundingMetadata };
  } catch (error) {
    console.error("Error generating workout idea:", error);
    return { text: "Não foi possível gerar uma ideia de treino no momento. Tente novamente mais tarde." };
  }
};
    