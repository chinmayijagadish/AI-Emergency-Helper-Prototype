
import { GoogleGenAI, Type } from "@google/genai";
import { FirstAidResponse, SeverityLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are a calm and helpful Emergency First Aid Assistant. 
Your goal is to provide safe, simple, and clear step-by-step first-aid guidance only.
Do NOT provide medical diagnosis.
Assume the user has no medical training.
Always prioritize safety and emphasize calling emergency services for life-threatening situations.

Respond in JSON format following this structure:
{
  "situation": "Brief explanation",
  "immediateSteps": ["step 1", "step 2"],
  "safetyTips": ["tip 1", "tip 2"],
  "avoid": ["avoid 1", "avoid 2"],
  "whenToCallEmergency": ["condition 1", "condition 2"],
  "severityLevel": "LOW | MEDIUM | HIGH"
}`;

export async function getFirstAidGuidance(query: string): Promise<FirstAidResponse> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            situation: { type: Type.STRING },
            immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            avoid: { type: Type.ARRAY, items: { type: Type.STRING } },
            whenToCallEmergency: { type: Type.ARRAY, items: { type: Type.STRING } },
            severityLevel: { type: Type.STRING, enum: Object.values(SeverityLevel) }
          },
          required: ["situation", "immediateSteps", "safetyTips", "avoid", "whenToCallEmergency", "severityLevel"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response received from AI");
    
    return JSON.parse(text) as FirstAidResponse;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Unable to fetch first aid guidance. Please call your local emergency number if this is an urgent matter.");
  }
}
