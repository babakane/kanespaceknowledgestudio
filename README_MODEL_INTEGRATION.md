# Kanespace Knowledge Base Studio - Cloud Model Integration

## 🎯 Overview

This project integrates Hugging Face models stored in cloud storage (Google Drive, AWS S3, Dropbox, etc.) with your Kanespace Knowledge Base Studio application. The system supports multiple model providers with automatic fallback capabilities.

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│    Kanespace Knowledge Studio   │
│         (React + Vite)          │
└────────────┬────────────────────┘
             │
    ┌────────▼──────────┐
    │ HybridModelService│  (Smart routing and fallback)
    └────┬───────────┬──┘
         │           │
    ┌────▼──┐   ┌────▼──────────┐
    │Google │   │HuggingFaceServ│
    │GenAI  │   │    (with HF API)
    └───────┘   └────┬──────────┘
                     │
            ┌────────▼─────────┐
            │CloudStorageManager│
            └────┬────┬────┬────┘
                 │    │    │
            ┌────▼─┐ ┌─▼──┐ ┌──▼────┐
            │Google│ │AWS │ │Dropbox│
            │Drive │ │S3  │ │       │
            └──────┘ └────┘ └───────┘
```

## ✨ Key Features

- ✅ **Multi-Provider Support**: Google GenAI + Hugging Face
- ✅ **Cloud Storage Integration**: Google Drive, AWS S3, Dropbox
- ✅ **Automatic Caching**: Local model caching to reduce cloud calls
- ✅ **Fallback Mechanisms**: Automatic provider switching on failure
- ✅ **Response Caching**: Cache dialogue responses for repeated queries
- ✅ **Production Ready**: Error handling, logging, and monitoring
- ✅ **Easy Configuration**: Environment-based setup with examples

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- API keys from:
  - Google GenAI (optional)
  - Hugging Face (required for HF models)
  - Cloud storage provider (Google Drive, AWS S3, or Dropbox)

### 1. Clone and Install

```bash
cd "d:\Experimental_project\Kanespace Knowledge Base Studio"
npm install
```

### 2. Configure Environment

Copy the appropriate example from `config.examples.ts` to `.env`:

**For Google Drive + Hugging Face:**
```env
MODEL_PROVIDER=huggingface
HF_API_KEY=hf_your_token_here
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

CLOUD_STORAGE_PROVIDER=google-drive
GOOGLE_DRIVE_FILE_ID=your_file_id
MODEL_STORAGE_URL=https://drive.google.com/uc?id=your_file_id&export=download
```

### 3. Test Your Setup

```bash
npm run test:setup
```

### 4. Run the Application

```bash
npm run dev
```

## 📚 Documentation

### Main Guides
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Architecture and implementation overview
- [CLOUD_MODEL_INTEGRATION.md](./CLOUD_MODEL_INTEGRATION.md) - Detailed setup and usage guide
- [config.examples.ts](./config.examples.ts) - Configuration templates and model recommendations

### Service Files
- `services/hybridModelService.ts` - Main service with provider routing
- `services/huggingFaceService.ts` - Hugging Face integration
- `services/cloudStorageManager.ts` - Cloud storage handling
- `setup-utils.ts` - Setup wizard and testing utilities

## 🛠️ Configuration

### Environment Variables

```env
# Model Provider
MODEL_PROVIDER=google|huggingface
MODEL_FALLBACK_PROVIDER=google|huggingface

# Google GenAI
API_KEY=your_google_api_key

# Hugging Face
HF_API_KEY=your_huggingface_token
MODEL_NAME=model_name_on_hf

# Cloud Storage
CLOUD_STORAGE_PROVIDER=google-drive|s3|dropbox
MODEL_STORAGE_URL=your_download_url

# Caching
MODEL_CACHE_DIR=./models
ENABLE_RESPONSE_CACHING=true
```

See [config.examples.ts](./config.examples.ts) for complete examples.

## 💡 Usage Examples

### Initialize Services
```typescript
import { hybridService } from './services/hybridModelService';

// Initialize on app startup
useEffect(() => {
  hybridService.initialize();
}, []);
```

### Generate Dialogue
```typescript
const dialogue = await hybridService.generateDialogue(
  'Your topic here',
  'Optional context'
);
```

### Check Service Status
```typescript
const status = hybridService.getStatus();
console.log(status.currentProvider); // 'google' or 'huggingface'
```

### Download from Cloud Storage
```typescript
import { googleDriveManager } from './services/cloudStorageManager';

const modelPath = await googleDriveManager.downloadFromGoogleDrive(
  'FILE_ID',
  'model.zip'
);
```

## 🎯 Model Selection

### Recommended Models

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| Mistral-7B-Instruct | 7B | ⚡⚡⚡ | ⭐⭐⭐⭐ | General dialogue |
| Llama-2-7B-Chat | 7B | ⚡⚡⚡ | ⭐⭐⭐⭐ | Conversational |
| Llama-2-13B-Chat | 13B | ⚡⚡ | ⭐⭐⭐⭐⭐ | Advanced dialogue |
| Phi-2 | 2.7B | ⚡⚡⚡⚡ | ⭐⭐⭐ | Fast inference |
| DialoGPT-Large | 365M | ⚡⚡⚡⚡ | ⭐⭐⭐ | Lightweight |

See [config.examples.ts](./config.examples.ts) for more options.

## 🔧 Cloud Storage Setup

### Google Drive
1. Upload your model to Google Drive
2. Right-click → Share → Get shareable link
3. Extract file ID: `https://drive.google.com/file/d/{FILE_ID}/view`
4. Set environment variable:
   ```env
   GOOGLE_DRIVE_FILE_ID=FILE_ID
   ```

### AWS S3
1. Upload model to S3 bucket
2. Get AWS credentials from IAM console
3. Set environment variables:
   ```env
   AWS_ACCESS_KEY_ID=YOUR_KEY
   AWS_SECRET_ACCESS_KEY=YOUR_SECRET
   AWS_S3_BUCKET=your-bucket
   ```

### Dropbox
1. Create app in Dropbox Developer Console
2. Generate access token
3. Set environment variables:
   ```env
   DROPBOX_TOKEN=YOUR_TOKEN
   DROPBOX_PATH=/Models/model.tar.gz
   ```

## 🧪 Testing

### Run Setup Tests
```bash
npm run test:setup
```

Tests verify:
- ✅ Environment variables
- ✅ Google GenAI configuration
- ✅ Hugging Face configuration
- ✅ Cloud storage connectivity
- ✅ Model inference capability

## 📊 Performance

### Benchmarks (Approximate)

| Model | Inference Time | Memory Usage |
|-------|---|---|
| Mistral-7B | 2-5s | 8GB |
| Llama-2-7B | 3-6s | 8GB |
| Llama-2-13B | 5-10s | 16GB |
| Phi-2 | 1-3s | 4GB |

### Optimization Tips

1. **Enable Response Caching**
   ```env
   ENABLE_RESPONSE_CACHING=true
   ```

2. **Use Quantized Models**
   ```env
   MODEL_NAME=model-name-GPTQ
   ```

3. **Set Appropriate Batch Size**
   ```env
   BATCH_SIZE=1
   ```

4. **Implement Request Batching**
   ```typescript
   const results = await Promise.all(
     topics.map(t => hybridService.generateDialogue(t))
   );
   ```

## 🚨 Troubleshooting

### Model Download Timeout
Increase timeout:
```env
INFERENCE_TIMEOUT=300000
```

### Out of Memory
Use smaller model:
```env
MODEL_NAME=microsoft/phi-2
```

### Slow Inference
Enable caching and use quantization:
```env
ENABLE_RESPONSE_CACHING=true
MODEL_NAME=model-GPTQ
```

### Cloud Storage Connection Issues
- Verify credentials
- Check file accessibility
- Ensure network connectivity
- Review error logs

## 📝 Project Structure

```
Kanespace Knowledge Base Studio/
├── services/
│   ├── geminiService.ts              # Original Google service
│   ├── huggingFaceService.ts         # HF integration
│   ├── hybridModelService.ts         # Main service with routing
│   └── cloudStorageManager.ts        # Cloud storage handling
├── .env                              # Configuration
├── config.examples.ts                # Configuration templates
├── setup-utils.ts                    # Setup utilities
├── INTEGRATION_GUIDE.md              # Architecture overview
├── CLOUD_MODEL_INTEGRATION.md        # Detailed setup guide
└── README.md                         # This file
```

## 🔐 Security

### Best Practices

1. **Never commit .env files**
   ```
   .env
   .env.local
   .env.*.local
   ```

2. **Use environment variables for secrets**
   - API keys
   - Access tokens
   - AWS credentials

3. **Implement request authentication**
   - Use API keys for cloud API access
   - Implement JWT for server endpoints

4. **Monitor API usage**
   - Track inference counts
   - Monitor costs
   - Set up billing alerts

## 📈 Monitoring and Logging

### Key Metrics to Track

```typescript
const status = hybridService.getStatus();
console.log({
  currentProvider: status.currentProvider,
  cachingEnabled: status.cachingEnabled,
  cacheSize: status.cacheSize,
  googleAIReady: status.googleAIReady,
  huggingFaceReady: status.huggingFaceReady
});
```

### Performance Monitoring

```typescript
const startTime = Date.now();
const dialogue = await hybridService.generateDialogue(topic);
const duration = Date.now() - startTime;
console.log(`Inference time: ${duration}ms`);
```

## 🚀 Deployment

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV MODEL_PROVIDER=huggingface
CMD ["npm", "run", "preview"]
```

### Environment-Specific Setup

**Development:**
```env
MODEL_PROVIDER=google
ENABLE_RESPONSE_CACHING=true
```

**Production:**
```env
MODEL_PROVIDER=huggingface
USE_CLOUD_API=true
ENABLE_RESPONSE_CACHING=true
```

## 📦 Dependencies

```json
{
  "axios": "^1.6.2",
  "dotenv": "^16.3.1",
  "transformers": "^3.0.0",
  "@huggingface/hub": "^0.15.1",
  "tar": "^6.2.0",
  "unzipper": "^0.10.14"
}
```

## 🤝 Contributing

To extend this integration:

1. Add new cloud storage provider in `cloudStorageManager.ts`
2. Add new model provider in `hybridModelService.ts`
3. Update configuration examples in `config.examples.ts`
4. Add tests in `setup-utils.ts`

## 📚 Resources

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Google GenAI API](https://ai.google.dev)
- [Google Drive API](https://developers.google.com/drive)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Dropbox API](https://www.dropbox.com/developers)

## 📄 License

See LICENSE file in project root.

## 🆘 Support

For issues and questions:
1. Check [CLOUD_MODEL_INTEGRATION.md](./CLOUD_MODEL_INTEGRATION.md)
2. Review [setup-utils.ts](./setup-utils.ts) for examples
3. Run `npm run test:setup` to diagnose problems
4. Check error logs for detailed messages

---

**Happy coding! 🎉**
