import axios from 'axios';
import { ShowDialogue, ParticipantType, SpeechPart, ResearchSource } from '../types';
import * as fs from 'fs';
import * as path from 'path';

interface ModelConfig {
  modelName: string;
  storageUrl: string;
  apiKey: string;
  cacheDir: string;
  useCloudApi: boolean;
  apiEndpoint?: string;
}

class HuggingFaceService {
  private modelConfig: ModelConfig;
  private modelLoaded = false;
  private model: any = null;

  constructor() {
    this.modelConfig = {
      modelName: import.meta.env.VITE_MODEL_NAME || 'mistralai/Mistral-7B-Instruct-v0.1',
      storageUrl: import.meta.env.VITE_MODEL_STORAGE_URL || '',
      apiKey: import.meta.env.VITE_HF_API_KEY || '',
      cacheDir: import.meta.env.VITE_MODEL_CACHE_DIR || './models',
      useCloudApi: import.meta.env.VITE_USE_CLOUD_API === 'true',
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000'
    };

    this.ensureCacheDir();
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    if (!fs.existsSync(this.modelConfig.cacheDir)) {
      fs.mkdirSync(this.modelConfig.cacheDir, { recursive: true });
    }
  }

  /**
   * Download model from cloud storage (Google Drive, S3, etc.)
   */
  async downloadModelFromCloud(): Promise<string> {
    try {
      const modelPath = path.join(this.modelConfig.cacheDir, 'model');
      
      // Check if model already cached
      if (fs.existsSync(modelPath)) {
        console.log('Model found in cache:', modelPath);
        return modelPath;
      }

      if (!this.modelConfig.storageUrl) {
        throw new Error('MODEL_STORAGE_URL not configured. Please set it in .env file.');
      }

      console.log('Downloading model from:', this.modelConfig.storageUrl);
      
      const response = await axios.get(this.modelConfig.storageUrl, {
        responseType: 'arraybuffer',
        timeout: 300000 // 5 minutes
      });

      // Save model to cache
      fs.writeFileSync(modelPath, response.data);
      console.log('Model downloaded and cached:', modelPath);

      return modelPath;
    } catch (error) {
      console.error('Error downloading model from cloud:', error);
      throw error;
    }
  }

  /**
   * Load model from Hugging Face Hub directly
   */
  async loadFromHuggingFaceHub(): Promise<void> {
    try {
      // Using Hugging Face Inference API
      const response = await axios.get(
        `https://huggingface.co/api/models/${this.modelConfig.modelName}`,
        {
          headers: {
            Authorization: `Bearer ${this.modelConfig.apiKey}`
          }
        }
      );

      console.log('Model loaded from Hugging Face Hub:', response.data.id);
      this.modelLoaded = true;
      this.model = response.data;
    } catch (error) {
      console.error('Error loading model from Hugging Face Hub:', error);
      throw error;
    }
  }

  /**
   * Generate dialogue using cloud API or local model
   */
  async generateDialogue(topic: string, context: string): Promise<ShowDialogue> {
    try {
      if (this.modelConfig.useCloudApi) {
        return await this.generateViaCloudAPI(topic, context);
      } else {
        return await this.generateViaLocalModel(topic, context);
      }
    } catch (error) {
      console.error('Error generating dialogue:', error);
      throw error;
    }
  }

  /**
   * Generate dialogue via cloud API endpoint
   */
  private async generateViaCloudAPI(topic: string, context: string): Promise<ShowDialogue> {
    try {
      const response = await axios.post(
        `${this.modelConfig.apiEndpoint}/api/generate`,
        {
          topic,
          context,
          modelName: this.modelConfig.modelName
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.modelConfig.apiKey
          },
          timeout: 60000
        }
      );

      return response.data as ShowDialogue;
    } catch (error) {
      console.error('Error calling cloud API:', error);
      throw error;
    }
  }

  /**
   * Generate dialogue using local/cached model
   */
  private async generateViaLocalModel(topic: string, context: string): Promise<ShowDialogue> {
    try {
      // Prepare prompt
      const prompt = this.buildPrompt(topic, context);

      // Call Hugging Face Inference API with the model
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.modelConfig.modelName}`,
        {
          inputs: prompt,
          parameters: {
            max_length: 2000,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.modelConfig.apiKey}`
          },
          timeout: 60000
        }
      );

      // Parse and structure the response
      return this.parseModelResponse(response.data, topic);
    } catch (error) {
      console.error('Error generating with local model:', error);
      throw error;
    }
  }

  /**
   * Build prompt for dialogue generation
   */
  private buildPrompt(topic: string, context: string): string {
    return `Generate a professional dialogue about the following topic:

Topic: ${topic}

Context: ${context}

Create a structured dialogue with:
1. An introduction from a PRESENTER
2. A discussion between GUEST_A and GUEST_B with different perspectives
3. A synthesis/conclusion from the PRESENTER
4. Include research sources

Format each speaker's line with speaker role, name, location, and emotional tone.`;
  }

  /**
   * Parse model response into ShowDialogue format
   */
  private parseModelResponse(modelOutput: any, topic: string): ShowDialogue {
    try {
      // Extract text from model output
      const text = typeof modelOutput === 'string' 
        ? modelOutput 
        : modelOutput[0]?.generated_text || JSON.stringify(modelOutput);

      // Create structured dialogue
      const dialogue: ShowDialogue = {
        intro: this.createSpeechPart(
          ParticipantType.PRESENTER,
          'Knowledge Expert',
          'Studio',
          'Host',
          `Today we're discussing: ${topic}`,
          'neutral'
        ),
        discussion: [
          this.createSpeechPart(
            ParticipantType.GUEST_A,
            'Expert A',
            'Remote',
            'Specialist',
            text.substring(0, Math.floor(text.length / 2)),
            'professional'
          ),
          this.createSpeechPart(
            ParticipantType.GUEST_B,
            'Expert B',
            'Remote',
            'Analyst',
            text.substring(Math.floor(text.length / 2)),
            'thoughtful'
          )
        ],
        synthesis: this.createSpeechPart(
          ParticipantType.PRESENTER,
          'Knowledge Expert',
          'Studio',
          'Host',
          `To summarize our discussion about ${topic}...`,
          'analytical'
        ),
        sources: this.extractSources(text)
      };

      return dialogue;
    } catch (error) {
      console.error('Error parsing model response:', error);
      throw new Error('Failed to parse model response into dialogue format');
    }
  }

  /**
   * Helper to create SpeechPart
   */
  private createSpeechPart(
    speaker: ParticipantType,
    name: string,
    location: string,
    role: string,
    text: string,
    emotion: string
  ): SpeechPart {
    return { speaker, name, location, role, text, emotion };
  }

  /**
   * Extract sources from text
   */
  private extractSources(text: string): ResearchSource[] {
    const sources: ResearchSource[] = [];
    
    // Simple URL extraction regex
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = text.match(urlRegex) || [];

    urls.forEach((url, index) => {
      sources.push({
        title: `Source ${index + 1}`,
        uri: url
      });
    });

    // Add default sources if none found
    if (sources.length === 0) {
      sources.push({
        title: 'Hugging Face Models',
        uri: 'https://huggingface.co/models'
      });
    }

    return sources;
  }

  /**
   * Get model status
   */
  getModelStatus(): {
    loaded: boolean;
    modelName: string;
    cacheDir: string;
    useCloudApi: boolean;
  } {
    return {
      loaded: this.modelLoaded,
      modelName: this.modelConfig.modelName,
      cacheDir: this.modelConfig.cacheDir,
      useCloudApi: this.modelConfig.useCloudApi
    };
  }

  /**
   * Initialize model (download/load as needed)
   */
  async initialize(): Promise<void> {
    try {
      if (this.modelConfig.useCloudApi) {
        console.log('Using Cloud API mode');
      } else {
        console.log('Initializing Hugging Face model:', this.modelConfig.modelName);
        await this.loadFromHuggingFaceHub();
      }
    } catch (error) {
      console.error('Error initializing model:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const hfService = new HuggingFaceService();
export default HuggingFaceService;
