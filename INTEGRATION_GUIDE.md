# Hugging Face Model Integration Guide

## Approach Overview

This guide covers integrating Hugging Face models stored in cloud storage (Google Drive, AWS S3, etc.) into your Kanespace Knowledge Base Studio project.

### Architecture Options

#### Option 1: Direct Cloud Storage Access (Recommended for Development)
- Store model files on Google Drive/Dropbox
- Download and cache locally on first run
- Load model from local cache for subsequent runs

#### Option 2: API Server Approach (Recommended for Production)
- Deploy model on a dedicated server
- Access via REST API endpoints
- Reduced client-side storage requirements

#### Option 3: Hybrid Approach
- Model stored in cloud storage
- Served via local or cloud API
- Best for scalability and performance

## Implementation Steps

### Step 1: Setup Environment Variables

```env
# .env file
HF_API_KEY=your_hugging_face_api_key
MODEL_NAME=model-name-on-huggingface
MODEL_STORAGE_URL=https://drive.google.com/uc?id=YOUR_FILE_ID
MODEL_CACHE_DIR=./models
USE_CLOUD_API=false
```

### Step 2: Install Required Dependencies

```bash
npm install axios dotenv transformers @huggingface/hub
```

### Step 3: Create Model Service Layer

See `services/huggingFaceService.ts` for implementation.

### Step 4: Update Existing Service

Replace or extend `geminiService.ts` to support both Google GenAI and Hugging Face models.

## Model Storage Options

### Google Drive Setup

1. Upload your model folder to Google Drive
2. Right-click → Share → Get sharable link
3. Extract file ID from URL: `https://drive.google.com/file/d/{FILE_ID}/view`
4. Create download URL: `https://drive.google.com/uc?id={FILE_ID}&export=download`

### AWS S3 Setup

```env
MODEL_STORAGE_URL=https://your-bucket.s3.amazonaws.com/model-name.tar.gz
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### Hugging Face Hub (Direct)

```env
USE_HF_HUB=true
MODEL_NAME=username/model-name
HF_API_KEY=your_hugging_face_token
```

## Supported Models

### Text Generation
- `mistralai/Mistral-7B-Instruct-v0.1`
- `meta-llama/Llama-2-7b-chat-hf`
- `tiiuae/falcon-7b-instruct`

### Dialogue & Conversation
- `facebook/blenderbot-400M-distill`
- `microsoft/DialoGPT-large`

### Question Answering
- `deepset/roberta-base-squad2`
- `bert-base-uncased-finetuned-mrpc`

## Performance Considerations

- **Model Size:** Keep under 2GB for client-side caching
- **Batch Processing:** Use inference batching for multiple requests
- **Quantization:** Use quantized versions (ONNX, TensorRT) for faster inference
- **Caching:** Implement response caching for repeated queries

## Testing

1. Test with a small model first (e.g., `distilbert-base-uncased`)
2. Verify cloud storage access
3. Check model inference latency
4. Validate output schema matches expected format

## Troubleshooting

### Model Download Issues
- Check internet connection
- Verify cloud storage links are accessible
- Check available disk space

### Inference Performance
- Use quantized models
- Implement batching
- Consider server-side deployment

### Memory Issues
- Reduce batch size
- Use smaller model variants
- Implement model caching
