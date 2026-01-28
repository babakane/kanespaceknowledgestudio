# 🎨 Visual Setup Guide - Cloud Model Integration

## 📋 Complete File Structure

```
Kanespace Knowledge Base Studio/
│
├── 📄 Core Application Files
│   ├── App.tsx                          # Main React component
│   ├── index.tsx                        # App entry point
│   ├── index.html                       # HTML template
│   └── types.ts                         # TypeScript types
│
├── 🔧 Configuration Files
│   ├── .env                             # Environment variables (YOUR CONFIG)
│   ├── .env.example                     # Example configuration
│   ├── package.json                     # Dependencies (UPDATED)
│   ├── tsconfig.json                    # TypeScript config
│   ├── vite.config.ts                   # Vite config
│   └── metadata.json                    # App metadata
│
├── 📚 Service Layer (NEW)
│   └── services/
│       ├── geminiService.ts             # Original Google service
│       ├── huggingFaceService.ts        # NEW: HF integration
│       ├── hybridModelService.ts        # NEW: Main service (use this!)
│       └── cloudStorageManager.ts       # NEW: Cloud storage handling
│
├── 🎨 Components
│   ├── Character.tsx                    # Character component
│   └── DialogueBox.tsx                  # Dialogue display
│
├── 📖 Documentation (NEW - READ THESE)
│   ├── IMPLEMENTATION_SUMMARY.md        # ⭐ START HERE - Quick overview
│   ├── CLOUD_MODEL_INTEGRATION.md       # ⭐ DETAILED setup guide
│   ├── INTEGRATION_GUIDE.md             # Architecture overview
│   ├── README_MODEL_INTEGRATION.md      # Complete reference
│   └── INTEGRATION_GUIDE.md             # Setup guidelines
│
├── ⚙️ Configuration Templates
│   ├── config.examples.ts               # 7 configuration examples
│   └── setup-utils.ts                   # Testing & setup utilities
│
└── 📦 Dependencies
    └── package.json                     # All required packages
```

---

## 🔌 How to Integrate (Step-by-Step)

### Step 1️⃣: Install Dependencies

```bash
# Navigate to project
cd "d:\Experimental_project\Kanespace Knowledge Base Studio"

# Install all packages
npm install
```

### Step 2️⃣: Choose Configuration

```
📋 Open: config.examples.ts

Choose ONE of these:
  1️⃣ Google Drive + Hugging Face (RECOMMENDED)
  2️⃣ AWS S3 + Hugging Face
  3️⃣ Dropbox + Hugging Face
  4️⃣ Google GenAI with HF fallback
```

### Step 3️⃣: Configure .env

```bash
# Copy your chosen config to .env
# Example for Google Drive:

MODEL_PROVIDER=huggingface
HF_API_KEY=hf_your_token_here
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

CLOUD_STORAGE_PROVIDER=google-drive
GOOGLE_DRIVE_FILE_ID=your_file_id
MODEL_STORAGE_URL=https://drive.google.com/uc?id=your_file_id&export=download

MODEL_CACHE_DIR=./models
ENABLE_RESPONSE_CACHING=true
```

### Step 4️⃣: Test Setup

```bash
npm run test:setup
```

✅ This validates your configuration

### Step 5️⃣: Use in Your App

```typescript
// In App.tsx
import { hybridService } from "./services/hybridModelService";

useEffect(() => {
  hybridService.initialize();
}, []);

// Generate dialogue
const dialogue = await hybridService.generateDialogue("Your topic");
```

---

## 🗺️ Setup Paths by Cloud Provider

### Path A: Google Drive (EASIEST - START HERE!)

```
1. Upload model to Google Drive
   └─> Right-click > Share > Get link
       └─> Extract FILE_ID from URL

2. Configure .env
   ├─ HF_API_KEY=your_token
   ├─ GOOGLE_DRIVE_FILE_ID=...
   └─ MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.1

3. Test
   └─ npm run test:setup

4. Done!
   └─ Your app can now use the model
```

### Path B: AWS S3

```
1. Upload model to S3
   ├─ Create S3 bucket
   ├─ Upload model file
   └─ Note bucket name and key

2. Get AWS Credentials
   ├─ Go to IAM console
   ├─ Create access key
   └─ Save access key ID & secret

3. Configure .env
   ├─ AWS_ACCESS_KEY_ID=...
   ├─ AWS_SECRET_ACCESS_KEY=...
   ├─ AWS_S3_BUCKET=your-bucket
   └─ AWS_S3_KEY=path/to/model

4. Test
   └─ npm run test:setup

5. Done!
```

### Path C: Dropbox

```
1. Create Dropbox app
   ├─ https://www.dropbox.com/developers
   ├─ Create app
   └─ Generate token

2. Upload model
   ├─ Create /Models folder
   ├─ Upload model.tar.gz
   └─ Note path: /Models/model.tar.gz

3. Configure .env
   ├─ DROPBOX_TOKEN=...
   └─ DROPBOX_PATH=/Models/model.tar.gz

4. Test
   └─ npm run test:setup

5. Done!
```

---

## 🎯 Service Layer Architecture

```
Your React App
     │
     └─> hybridModelService (USE THIS!)
         │
         ├─> Check provider preference
         │
         ├─ Option 1: Google GenAI
         │  └─> Direct API call
         │
         └─ Option 2: Hugging Face
            └─> huggingFaceService
                │
                ├─ Load from HF Hub
                │  OR
                └─ Download from cloud storage
                   │
                   └─> cloudStorageManager
                       ├─ Google Drive
                       ├─ AWS S3
                       ├─ Dropbox
                       └─ Cache locally
```

---

## 🔑 Key Services

### 1️⃣ HybridModelService (MAIN - USE THIS!)

```typescript
import { hybridService } from "./services/hybridModelService";

// Initialize
await hybridService.initialize();

// Generate dialogue
const dialogue = await hybridService.generateDialogue("topic");

// Switch provider at runtime
hybridService.switchProvider("huggingface");

// Check status
const status = hybridService.getStatus();

// Clear cache
hybridService.clearCache();

// Enable/disable caching
hybridService.setCaching(true);
```

### 2️⃣ HuggingFaceService (OPTIONAL - Usually not needed directly)

```typescript
import { hfService } from "./services/huggingFaceService";

// Initialize
await hfService.initialize();

// Generate with HF
const dialogue = await hfService.generateDialogue(topic);

// Check model status
const status = hfService.getModelStatus();
```

### 3️⃣ CloudStorageManager (OPTIONAL - Usually not needed directly)

```typescript
import { googleDriveManager } from "./services/cloudStorageManager";

// Download from cloud
const path = await googleDriveManager.downloadFromGoogleDrive(
  "FILE_ID",
  "model.zip",
);

// Get cache stats
const stats = googleDriveManager.getCacheStats();

// Clear cache
googleDriveManager.clearCache();
```

---

## 📊 Configuration Decision Tree

```
Start: What do you want to do?
│
├─ "I want to use Google GenAI only"
│  └─ Use original geminiService.ts
│     └─ Just set API_KEY in .env
│
├─ "I want to use Hugging Face models"
│  │
│  ├─ "Models are on Hugging Face Hub (free)"
│  │  └─ CONFIG: MODEL_PROVIDER=huggingface
│  │     └─ Set HF_API_KEY + MODEL_NAME
│  │
│  └─ "I have models in cloud storage"
│     │
│     ├─ "In Google Drive"
│     │  └─ CONFIG: CLOUD_STORAGE_PROVIDER=google-drive
│     │     └─ Set GOOGLE_DRIVE_FILE_ID
│     │
│     ├─ "In AWS S3"
│     │  └─ CONFIG: CLOUD_STORAGE_PROVIDER=s3
│     │     └─ Set AWS credentials
│     │
│     └─ "In Dropbox"
│        └─ CONFIG: CLOUD_STORAGE_PROVIDER=dropbox
│           └─ Set DROPBOX_TOKEN
│
└─ "I want both (fallback)"
   └─ CONFIG: MODEL_PROVIDER=google
      └─ MODEL_FALLBACK_PROVIDER=huggingface
         └─ Set both providers' credentials
```

---

## 🚀 Usage Examples

### Example 1: Basic Dialogue Generation

```typescript
import { hybridService } from './services/hybridModelService';

function App() {
  const [dialogue, setDialogue] = useState(null);

  async function generateDialogue(topic: string) {
    try {
      const result = await hybridService.generateDialogue(topic);
      setDialogue(result);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <button onClick={() => generateDialogue('AI Ethics')}>
      Generate Dialogue
    </button>
  );
}
```

### Example 2: Check Service Status

```typescript
function ServiceStatus() {
  const status = hybridService.getStatus();

  return (
    <div>
      <p>Provider: {status.currentProvider}</p>
      <p>Caching: {status.cachingEnabled ? 'ON' : 'OFF'}</p>
      <p>Cached Responses: {status.cacheSize}</p>
      <p>Google AI: {status.googleAIReady ? '✅' : '❌'}</p>
      <p>Hugging Face: {status.huggingFaceReady ? '✅' : '❌'}</p>
    </div>
  );
}
```

### Example 3: Switch Provider at Runtime

```typescript
function ProviderToggle() {
  return (
    <div>
      <button onClick={() => hybridService.switchProvider('google')}>
        Use Google GenAI
      </button>
      <button onClick={() => hybridService.switchProvider('huggingface')}>
        Use Hugging Face
      </button>
    </div>
  );
}
```

### Example 4: Download Model from Cloud

```typescript
import CloudStorageManager from "./services/cloudStorageManager";

async function downloadModel() {
  const manager = new CloudStorageManager({
    provider: "google-drive",
  });

  const modelPath = await manager.downloadFromGoogleDrive(
    process.env.GOOGLE_DRIVE_FILE_ID!,
    "model.tar.gz",
  );

  console.log("Model downloaded to:", modelPath);
}
```

---

## ✅ Verification Checklist

```
After Setup, Verify:

1. Dependencies Installed
   □ npm ls (should show all packages)

2. Environment Variables
   □ .env file exists
   □ API keys are set
   □ Cloud storage configured
   □ .env is in .gitignore

3. Services Load
   □ No import errors
   □ Types compile correctly
   □ Services initialize

4. Configuration Valid
   □ npm run test:setup passes
   □ All required env vars present
   □ Cloud storage connection works

5. Model Inference
   □ Model can be loaded
   □ Dialogue generation works
   □ Response format is correct

6. Integration
   □ Services imported in App
   □ Initialization in useEffect
   □ Error handling implemented
```

---

## 📞 Quick Reference

### Most Common Issues & Fixes

| Issue                | Solution               |
| -------------------- | ---------------------- |
| Module not found     | Run `npm install`      |
| API key invalid      | Check .env file        |
| Cloud download fails | Verify file ID/URL     |
| Out of memory        | Use smaller model      |
| Slow inference       | Enable caching         |
| CORS errors          | Use API server instead |

### Useful Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run test:setup    # Run setup tests
npm run test:cloud    # Test cloud storage
npm run test:hybrid   # Test hybrid service
```

---

## 🎯 Next Actions

1. **READ**: `IMPLEMENTATION_SUMMARY.md` (quick overview)
2. **READ**: `CLOUD_MODEL_INTEGRATION.md` (detailed guide)
3. **CHOOSE**: Your cloud storage provider
4. **CONFIGURE**: `.env` file
5. **TEST**: `npm run test:setup`
6. **INTEGRATE**: Into your React components
7. **DEPLOY**: To production

---

## 📚 Documentation Map

```
Where to find what:

Quick Overview?          → IMPLEMENTATION_SUMMARY.md
Setup Instructions?      → CLOUD_MODEL_INTEGRATION.md
Architecture?            → INTEGRATION_GUIDE.md
Complete Reference?      → README_MODEL_INTEGRATION.md
Config Examples?         → config.examples.ts
Testing/Setup?           → setup-utils.ts
```

---

**You're all set! Begin with `IMPLEMENTATION_SUMMARY.md` for an overview, then move to `CLOUD_MODEL_INTEGRATION.md` for detailed setup instructions.** 🚀
