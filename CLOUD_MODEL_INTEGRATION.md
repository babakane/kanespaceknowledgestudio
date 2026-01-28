# Cloud-Stored Hugging Face Model Integration Guide

## Overview

This guide walks through integrating a Hugging Face model stored in cloud storage (Google Drive, AWS S3, Dropbox, etc.) into your Kanespace Knowledge Base Studio application.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Application                      │
│                  (Kanespace Knowledge Studio)               │
└────────────────────────────┬────────────────────────────────┘
                             │
                    Uses HybridModelService
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐    ┌─────────▼──────┐  ┌────────▼────┐
    │  Google │    │  Hugging Face  │  │Cloud Storage│
    │ GenAI   │    │   API Server    │  │  Manager    │
    └─────────┘    └────────────────┘  └────────┬────┘
                                                 │
                         ┌───────────────────────┼────────────────┐
                         │                       │                │
                    ┌────▼────┐         ┌───────▼──┐      ┌──────▼─┐
                    │ Google  │         │   AWS   │      │Dropbox │
                    │  Drive  │         │   S3    │      │        │
                    └─────────┘         └─────────┘      └────────┘
```

## Quick Start Setup

### 1. Prepare Your Model on Google Drive

**Steps:**

1. Upload your model folder to Google Drive
2. Right-click the folder → Share → Copy the shareable link
3. Extract the file ID from URL: `https://drive.google.com/file/d/{FILE_ID}/view`

**Example:**

```
URL: https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7/view
FILE_ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7
```

### 2. Configure Environment Variables

Update `.env` file:

```env
# Primary provider
MODEL_PROVIDER=huggingface
MODEL_FALLBACK_PROVIDER=google

# Hugging Face settings
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

# Cloud storage (Google Drive)
CLOUD_STORAGE_PROVIDER=google-drive
GOOGLE_DRIVE_FILE_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7
MODEL_STORAGE_URL=https://drive.google.com/uc?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7&export=download

# Caching
MODEL_CACHE_DIR=./models
ENABLE_RESPONSE_CACHING=true
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Services in Your App

**In `App.tsx` or main entry point:**

```typescript
import { hybridService } from "./services/hybridModelService";
import { cloudStorageManager } from "./services/cloudStorageManager";

// On app initialization
useEffect(() => {
  const initializeServices = async () => {
    try {
      // Initialize model service
      await hybridService.initialize();
      console.log("Hybrid service initialized:", hybridService.getStatus());

      // (Optional) Download model from cloud storage
      const modelPath = await cloudStorageManager.downloadFromGoogleDrive(
        process.env.GOOGLE_DRIVE_FILE_ID!,
        "model.tar.gz",
      );
      console.log("Model downloaded to:", modelPath);
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };

  initializeServices();
}, []);
```

## Usage Examples

### Using Hybrid Model Service

```typescript
import { hybridService } from "./services/hybridModelService";

// Generate dialogue
async function generateContent(topic: string) {
  try {
    const dialogue = await hybridService.generateDialogue(topic);
    console.log("Generated dialogue:", dialogue);
  } catch (error) {
    console.error("Generation failed:", error);
  }
}

// Switch providers at runtime
hybridService.switchProvider("huggingface");

// Get service status
const status = hybridService.getStatus();
console.log("Current provider:", status.currentProvider);
```

### Using Cloud Storage Manager

```typescript
import CloudStorageManager from "./services/cloudStorageManager";

// Download from Google Drive
const manager = new CloudStorageManager({ provider: "google-drive" });
const modelPath = await manager.downloadFromGoogleDrive("FILE_ID", "model.zip");

// Extract archive
const extractedPath = await manager.extractArchive(modelPath);

// Check cache
const cached = manager.getFromCache("model.zip");

// Get cache statistics
const stats = manager.getCacheStats();
console.log(`Cache size: ${stats.totalSize} bytes`);
```

### Using Hugging Face Service Directly

```typescript
import { hfService } from "./services/huggingFaceService";

// Initialize
await hfService.initialize();

// Generate dialogue
const dialogue = await hfService.generateDialogue(
  "Topic about AI",
  "Additional context here",
);

// Check status
const status = hfService.getModelStatus();
console.log("Model loaded:", status.loaded);
```

## Cloud Storage Setup Guides

### Google Drive Setup

1. **Create shared folder:**
   - Create folder in Google Drive
   - Right-click → Share → Get link
   - Set to "Anyone with the link"

2. **Extract file ID:**

   ```
   Share link: https://drive.google.com/file/d/1abc123xyz789/view?usp=sharing
   File ID: 1abc123xyz789
   ```

3. **Create download URL:**
   ```
   https://drive.google.com/uc?id=1abc123xyz789&export=download
   ```

### AWS S3 Setup

1. **Upload model to S3:**

   ```bash
   aws s3 cp model.tar.gz s3://my-bucket/models/
   ```

2. **Configure credentials:**

   ```env
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=my-bucket
   AWS_S3_KEY=models/model.tar.gz
   ```

3. **Use in code:**
   ```typescript
   const manager = new CloudStorageManager({ provider: "s3" });
   const modelPath = await manager.downloadFromS3(
     "my-bucket",
     "models/model.tar.gz",
     "model.tar.gz",
   );
   ```

### Dropbox Setup

1. **Generate token:**
   - Go to Dropbox Developer Console
   - Create app
   - Generate access token

2. **Configure credentials:**

   ```env
   DROPBOX_TOKEN=sl.Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   DROPBOX_PATH=/Models/model.tar.gz
   ```

3. **Use in code:**
   ```typescript
   const manager = new CloudStorageManager({
     provider: "dropbox",
     credentials: {
       DROPBOX_TOKEN: process.env.DROPBOX_TOKEN,
     },
   });
   const modelPath = await manager.downloadFromDropbox(
     "/Models/model.tar.gz",
     "model.tar.gz",
   );
   ```

## Model Selection Guide

### Recommended Models for Your Use Case

**For Text Generation & Dialogue:**

- `mistralai/Mistral-7B-Instruct-v0.1` - Balanced performance/speed
- `meta-llama/Llama-2-7b-chat-hf` - Strong dialogue capabilities
- `meta-llama/Llama-2-13b-chat-hf` - Better quality, higher resource needs

**For Question Answering:**

- `deepset/roberta-base-squad2`
- `facebook/blenderbot-400M-distill`

**For Fast Inference (Edge Devices):**

- `distilbert-base-uncased`
- `microsoft/phi-2`

## Performance Optimization

### Caching Strategy

```typescript
// Enable response caching
hybridService.setCaching(true);

// Clear cache when needed
hybridService.clearCache();

// Check cache size
const status = hybridService.getStatus();
console.log("Cached responses:", status.cacheSize);
```

### Model Quantization

For faster inference, use quantized model versions:

```env
# Use ONNX quantized version
MODEL_NAME=onnx-community/mistral-7b-instruct-v0_1-quantized
```

### Batch Processing

```typescript
// Process multiple topics efficiently
const topics = ["AI", "Machine Learning", "Deep Learning"];
const dialogues = await Promise.all(
  topics.map((topic) => hybridService.generateDialogue(topic)),
);
```

## Deployment Considerations

### Production Deployment

1. **Use server-side model serving:**

   ```env
   USE_CLOUD_API=true
   API_ENDPOINT=https://your-api-server.com
   ```

2. **Set up authentication:**
   - Use API keys for cloud storage
   - Implement JWT tokens for API endpoints

3. **Enable monitoring:**
   - Log inference times
   - Monitor cache hit rates
   - Track API usage

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Download model during build if needed
RUN npm run download-model

ENV MODEL_PROVIDER=huggingface
ENV NODE_ENV=production

CMD ["npm", "run", "build"]
```

## Troubleshooting

### Common Issues

**Issue: Model download timeout**

```typescript
// Increase timeout in environment
INFERENCE_TIMEOUT = 600000; // 10 minutes
```

**Issue: Out of memory**

```typescript
// Use smaller model variant
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1-GPTQ
```

**Issue: Slow inference**

```typescript
// Enable caching and quantization
ENABLE_RESPONSE_CACHING=true
// Use ONNX runtime
npm install onnxruntime-node
```

## Next Steps

1. ✅ Configure `.env` with your cloud storage details
2. ✅ Install dependencies: `npm install`
3. ✅ Test cloud storage connection
4. ✅ Initialize services in your app
5. ✅ Generate test dialogues
6. ✅ Monitor performance and optimize

## Support Resources

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Google Drive API](https://developers.google.com/drive)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Dropbox API](https://www.dropbox.com/developers/documentation)
