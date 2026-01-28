import { GoogleGenAI, Type } from "@google/genai";
import { ShowDialogue, ParticipantType, ResearchSource } from "../types";
import { hfService } from "./huggingFaceService";

type ModelProvider = 'google' | 'huggingface';

interface HybridServiceConfig {
  provider: ModelProvider;
  fallbackProvider?: ModelProvider;
  enableCaching: boolean;
}

class HybridModelService {
  private googleAI: GoogleGenAI | null = null;
  private config: HybridServiceConfig;
  private responseCache: Map<string, ShowDialogue> = new Map();
  private responseSchema: any;

  constructor(
    config: HybridServiceConfig = {
      provider: (import.meta.env.VITE_MODEL_PROVIDER || 'google') as ModelProvider,
      fallbackProvider: 'huggingface',
      enableCaching: true
    }
  ) {
    this.config = config;
    this.initializeGoogleAI();
    this.setupResponseSchema();
  }

  /**
   * Initialize Google GenAI if using Google provider
   */
  private initializeGoogleAI(): void {
    if (this.config.provider === 'google' && import.meta.env.VITE_API_KEY) {
      this.googleAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      console.log('Google GenAI initialized');
    }
  }

  /**
   * Setup response schema for structured output
   */
  private setupResponseSchema(): void {
    this.responseSchema = {
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
  }

  /**
   * Generate dialogue using configured provider
   */
  async generateDialogue(topic: string, additionalContext?: string): Promise<ShowDialogue> {
    try {
      const cacheKey = `${this.config.provider}:${topic}`;
      
      // Check cache
      if (this.config.enableCaching && this.responseCache.has(cacheKey)) {
        console.log('Returning cached response for topic:', topic);
        return this.responseCache.get(cacheKey)!;
      }

      // Generate based on provider
      let dialogue: ShowDialogue;
      
      if (this.config.provider === 'google') {
        dialogue = await this.generateWithGoogle(topic, additionalContext);
      } else if (this.config.provider === 'huggingface') {
        dialogue = await this.generateWithHuggingFace(topic, additionalContext);
      } else {
        throw new Error(`Unknown provider: ${this.config.provider}`);
      }

      // Cache response
      if (this.config.enableCaching) {
        this.responseCache.set(cacheKey, dialogue);
      }

      return dialogue;
    } catch (error) {
      console.error('Error generating dialogue:', error);
      
      // Attempt fallback if configured
      if (this.config.fallbackProvider && this.config.fallbackProvider !== this.config.provider) {
        console.log('Attempting fallback provider:', this.config.fallbackProvider);
        const originalProvider = this.config.provider;
        this.config.provider = this.config.fallbackProvider;
        
        try {
          const dialogue = await this.generateDialogue(topic, additionalContext);
          this.config.provider = originalProvider;
          return dialogue;
        } catch (fallbackError) {
          this.config.provider = originalProvider;
          throw fallbackError;
        }
      }

      throw error;
    }
  }

  /**
   * Generate dialogue using Google GenAI
   */
  private async generateWithGoogle(topic: string, additionalContext?: string): Promise<ShowDialogue> {
    if (!this.googleAI) {
      throw new Error('Google GenAI not initialized. Set API_KEY in environment.');
    }

    const model = this.googleAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseSchema: this.responseSchema,
        responseMimeType: "application/json"
      }
    });

    const prompt = `Create a professional dialogue about: ${topic}${
      additionalContext ? `\n\nAdditional context: ${additionalContext}` : ''
    }

    Generate a structured dialogue with an introduction, discussion between two guests with different perspectives, and a synthesis by the presenter. Include relevant research sources.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      return JSON.parse(responseText) as ShowDialogue;
    } catch (e) {
      console.error('Failed to parse Google response as JSON:', responseText);
      throw new Error('Invalid response format from Google GenAI');
    }
  }

  /**
   * Generate dialogue using Hugging Face model
   */
  private async generateWithHuggingFace(topic: string, additionalContext?: string): Promise<ShowDialogue> {
    await hfService.initialize();
    return hfService.generateDialogue(topic, additionalContext || '');
  }

  /**
   * Switch model provider
   */
  switchProvider(provider: ModelProvider): void {
    console.log(`Switching model provider from ${this.config.provider} to ${provider}`);
    this.config.provider = provider;
  }

  /**
   * Clear response cache
   */
  clearCache(): void {
    this.responseCache.clear();
    console.log('Response cache cleared');
  }

  /**
   * Get service status
   */
  getStatus(): {
    currentProvider: ModelProvider;
    fallbackProvider?: ModelProvider;
    cachingEnabled: boolean;
    cacheSize: number;
    googleAIReady: boolean;
    huggingFaceReady: boolean;
  } {
    return {
      currentProvider: this.config.provider,
      fallbackProvider: this.config.fallbackProvider,
      cachingEnabled: this.config.enableCaching,
      cacheSize: this.responseCache.size,
      googleAIReady: this.googleAI !== null,
      huggingFaceReady: hfService.getModelStatus().loaded
    };
  }

  /**
   * Set caching behavior
   */
  setCaching(enabled: boolean): void {
    this.config.enableCaching = enabled;
    if (!enabled) {
      this.clearCache();
    }
  }
}

// Export singleton instance
export const hybridService = new HybridModelService();
export default HybridModelService;
