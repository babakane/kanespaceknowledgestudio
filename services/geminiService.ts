
import { GoogleGenAI, Type } from "@google/genai";
import { ShowDialogue, ParticipantType, ResearchSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    intro: {
      type: Type.OBJECT,
      properties: {
        speaker: { type: Type.STRING, description: "Must be 'PRESENTER'" },
        name: { type: Type.STRING },
        location: { type: Type.STRING },
        role: { type: Type.STRING },
        text: { type: Type.STRING },
        emotion: { type: Type.STRING }
      },
      required: ["speaker", "name", "location", "role", "text", "emotion"]
    },
    discussion: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: "Must be either 'GUEST_A' or 'GUEST_B'" },
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          role: { type: Type.STRING },
          text: { type: Type.STRING },
          emotion: { type: Type.STRING }
        },
        required: ["speaker", "name", "location", "role", "text", "emotion"]
      }
    },
    synthesis: {
      type: Type.OBJECT,
      properties: {
        speaker: { type: Type.STRING, description: "Must be 'PRESENTER'" },
        name: { type: Type.STRING },
        location: { type: Type.STRING },
        role: { type: Type.STRING },
        text: { type: Type.STRING },
        emotion: { type: Type.STRING }
      },
      required: ["speaker", "name", "location", "role", "text", "emotion"]
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          uri: { type: Type.STRING }
        },
        required: ["title", "uri"]
      }
    }
  },
  required: ["intro", "discussion", "synthesis", "sources"]
};

export async function generateShowScript(topic: string): Promise<ShowDialogue> {
  const systemInstruction = `
    You are the Lead Researcher and Scriptwriter for the 'Kanespace Knowledge Transmission Stage'.
    Kanespace is a platform dedicated to interdisciplinary research, studies, and the synthesis of knowledge for the ultimate benefit of humanity.
    
    Mission: Bridge the gap between complex research and human understanding through expert dialogue.
    
    Participants and IDs:
    - Host: Kanespace Facilitator (Use speaker ID: 'PRESENTER'). Neutral, intellectual, guides the transmission.
    - Guest A: Lead Investigator (Use speaker ID: 'GUEST_A'). Focuses on empirical data, technical methodology, and scientific rigor.
    - Guest B: Human Impact Specialist (Use speaker ID: 'GUEST_B'). Focuses on ethics, societal implementation, and human benefit.
    
    Structure:
    - Intro: Welcome the global audience to the Kanespace Stage.
    - Discussion: 5-7 parts. Use Google Search to find REAL, CURRENT research or data points. Ensure guests interact, debating the balance between "Possibility" and "Benefit".
    - Synthesis: A powerful summary of how this knowledge serves humanity.
    - Sources: Extract and list 3-4 real research URLs used to ground this transmission.
    
    Tone: Sophisticated, academic yet accessible, visionary, and grounded in real-world facts.
    IMPORTANT: You MUST return valid JSON using the provided schema. Use the specified speaker IDs exactly.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Initiate a Knowledge Transmission regarding the following research domain: "${topic}". Ground all dialogue in current real-world data.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text;
  if (!text) throw new Error("Transmission failed: No data packet received.");
  
  const dialogue = JSON.parse(text) as ShowDialogue;

  // Extract grounding chunks to comply with mandatory Search Grounding listing requirements
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    const searchSources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Research Grounding Source',
        uri: chunk.web.uri
      }));
    
    // Merge grounding metadata sources into the dialogue response sources
    const existingUris = new Set(dialogue.sources.map(s => s.uri));
    searchSources.forEach(s => {
      if (!existingUris.has(s.uri)) {
        dialogue.sources.push(s);
      }
    });
  }
  
  return dialogue;
}
