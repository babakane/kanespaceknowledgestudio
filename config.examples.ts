/**
 * Model Configuration Examples
 * Copy and adapt these examples to your .env file
 */

// ============================================
// Example 1: Google GenAI (Default)
// ============================================
const EXAMPLE_GOOGLE_GENAI = `
# Use Google GenAI with Hugging Face fallback
MODEL_PROVIDER=google
MODEL_FALLBACK_PROVIDER=huggingface
API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`;

// ============================================
// Example 2: Hugging Face via Google Drive
// ============================================
const EXAMPLE_HF_GOOGLE_DRIVE = `
# Hugging Face model stored on Google Drive
MODEL_PROVIDER=huggingface
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

# Google Drive storage
CLOUD_STORAGE_PROVIDER=google-drive
GOOGLE_DRIVE_FILE_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7
MODEL_STORAGE_URL=https://drive.google.com/uc?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7&export=download

# Caching
MODEL_CACHE_DIR=./models
ENABLE_RESPONSE_CACHING=true
`;

// ============================================
// Example 3: Hugging Face via AWS S3
// ============================================
const EXAMPLE_HF_AWS_S3 = `
# Hugging Face model stored on AWS S3
MODEL_PROVIDER=huggingface
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

# AWS S3 storage
CLOUD_STORAGE_PROVIDER=s3
AWS_S3_BUCKET=my-ml-models
AWS_S3_KEY=huggingface/mistral-7b
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# Caching
MODEL_CACHE_DIR=./models
ENABLE_RESPONSE_CACHING=true
`;

// ============================================
// Example 4: Hugging Face via Dropbox
// ============================================
const EXAMPLE_HF_DROPBOX = `
# Hugging Face model stored on Dropbox
MODEL_PROVIDER=huggingface
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

# Dropbox storage
CLOUD_STORAGE_PROVIDER=dropbox
DROPBOX_TOKEN=sl.Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DROPBOX_PATH=/ML-Models/mistral-7b.tar.gz

# Caching
MODEL_CACHE_DIR=./models
ENABLE_RESPONSE_CACHING=true
`;

// ============================================
// Example 5: Remote API Server
// ============================================
const EXAMPLE_REMOTE_API = `
# Use remote API server for model inference
MODEL_PROVIDER=huggingface
USE_CLOUD_API=true
API_ENDPOINT=https://ml-api.yourcompany.com

# API authentication
API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Fallback to local if API unavailable
MODEL_FALLBACK_PROVIDER=google
API_KEY_GOOGLE=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Caching
ENABLE_RESPONSE_CACHING=true
`;

// ============================================
// Example 6: Lightweight Model for Edge Devices
// ============================================
const EXAMPLE_LIGHTWEIGHT = `
# Lightweight model for fast inference
MODEL_PROVIDER=huggingface
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_NAME=microsoft/phi-2

# Cloud storage (for future updates)
CLOUD_STORAGE_PROVIDER=google-drive
MODEL_STORAGE_URL=https://drive.google.com/uc?id=xxxxx&export=download

# Performance settings
MAX_CONTEXT_LENGTH=1024
INFERENCE_TIMEOUT=30000
BATCH_SIZE=1
`;

// ============================================
// Example 7: Large Model with Quantization
// ============================================
const EXAMPLE_LARGE_QUANTIZED = `
# Large model with quantization for better performance
MODEL_PROVIDER=huggingface
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_NAME=meta-llama/Llama-2-13b-chat-hf-GPTQ

# Cloud storage
CLOUD_STORAGE_PROVIDER=s3
AWS_S3_BUCKET=ml-models
AWS_S3_KEY=llama-13b-gptq
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Performance optimizations
ENABLE_RESPONSE_CACHING=true
MODEL_CACHE_DIR=./models
INFERENCE_TIMEOUT=120000
`;

// ============================================
// Model Selection Matrix
// ============================================
interface ModelRecommendation {
  name: string;
  use_case: string;
  size: string;
  speed: string;
  quality: string;
  requirements: string;
  hugging_face_id: string;
}

const MODEL_RECOMMENDATIONS: ModelRecommendation[] = [
  {
    name: "Mistral-7B-Instruct",
    use_case: "General purpose dialogue, fast response",
    size: "7B parameters",
    speed: "⚡⚡⚡ Very Fast",
    quality: "⭐⭐⭐⭐ Good",
    requirements: "4-8GB VRAM",
    hugging_face_id: "mistralai/Mistral-7B-Instruct-v0.1"
  },
  {
    name: "Llama-2-7B-Chat",
    use_case: "Conversational AI, balanced performance",
    size: "7B parameters",
    speed: "⚡⚡⚡ Very Fast",
    quality: "⭐⭐⭐⭐ Good",
    requirements: "4-8GB VRAM",
    hugging_face_id: "meta-llama/Llama-2-7b-chat-hf"
  },
  {
    name: "Llama-2-13B-Chat",
    use_case: "Advanced dialogue, higher quality",
    size: "13B parameters",
    speed: "⚡⚡ Fast",
    quality: "⭐⭐⭐⭐⭐ Excellent",
    requirements: "16-20GB VRAM",
    hugging_face_id: "meta-llama/Llama-2-13b-chat-hf"
  },
  {
    name: "DialoGPT-Large",
    use_case: "Multi-turn dialogue, conversational",
    size: "365M parameters",
    speed: "⚡⚡⚡⚡ Ultra Fast",
    quality: "⭐⭐⭐ Good",
    requirements: "2-4GB VRAM",
    hugging_face_id: "microsoft/DialoGPT-large"
  },
  {
    name: "Phi-2",
    use_case: "Fast inference, compact model",
    size: "2.7B parameters",
    speed: "⚡⚡⚡⚡ Ultra Fast",
    quality: "⭐⭐⭐ Good",
    requirements: "2-4GB VRAM",
    hugging_face_id: "microsoft/phi-2"
  },
  {
    name: "Falcon-7B-Instruct",
    use_case: "Code generation, instruction following",
    size: "7B parameters",
    speed: "⚡⚡⚡ Very Fast",
    quality: "⭐⭐⭐⭐ Good",
    requirements: "4-8GB VRAM",
    hugging_face_id: "tiiuae/falcon-7b-instruct"
  }
];

// ============================================
// Setup Checklist
// ============================================
const SETUP_CHECKLIST = `
CLOUD-BASED HUGGING FACE MODEL SETUP CHECKLIST

Prerequisites:
□ Node.js 18+ installed
□ npm or yarn installed
□ Git repository initialized
□ .env file created in project root

Step 1: Choose Your Setup
□ Decide on model provider (Google GenAI, Hugging Face, etc.)
□ Choose cloud storage (Google Drive, AWS S3, Dropbox)
□ Select model from recommendations

Step 2: Get Credentials
□ Obtain Hugging Face API token from https://huggingface.co/settings/tokens
□ Get cloud storage credentials:
  □ Google Drive: Get file ID from shared link
  □ AWS S3: Create IAM user with S3 access
  □ Dropbox: Generate token from https://www.dropbox.com/developers

Step 3: Configure Environment
□ Copy appropriate example configuration to .env
□ Replace placeholder values with actual credentials
□ Verify .env file is in .gitignore

Step 4: Install Dependencies
□ Run: npm install
□ Verify all packages installed: npm ls

Step 5: Test Configuration
□ Create test script in src/test/
□ Initialize services
□ Test cloud storage connection
□ Test model inference
□ Check response format

Step 6: Integrate into Application
□ Import services in main component
□ Add initialization on app load
□ Add error handling and fallbacks
□ Test with real data

Step 7: Optimize and Deploy
□ Enable response caching
□ Test performance benchmarks
□ Consider model quantization for production
□ Set up monitoring and logging
□ Deploy to production

Step 8: Monitor and Maintain
□ Check API usage and costs
□ Monitor inference latency
□ Update models as needed
□ Maintain security of credentials
`;

export {
  EXAMPLE_GOOGLE_GENAI,
  EXAMPLE_HF_GOOGLE_DRIVE,
  EXAMPLE_HF_AWS_S3,
  EXAMPLE_HF_DROPBOX,
  EXAMPLE_REMOTE_API,
  EXAMPLE_LIGHTWEIGHT,
  EXAMPLE_LARGE_QUANTIZED,
  MODEL_RECOMMENDATIONS,
  SETUP_CHECKLIST,
  type ModelRecommendation
};
