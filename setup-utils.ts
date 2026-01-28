/**
 * Model Setup and Testing Utility
 * Use this to configure and test your cloud-based Hugging Face model setup
 */

import { hybridService } from './services/hybridModelService';
import { hfService } from './services/huggingFaceService';
import { googleDriveManager } from './services/cloudStorageManager';
import CloudStorageManager from './services/cloudStorageManager';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

class ModelSetupTester {
  private results: TestResult[] = [];

  /**
   * Run all setup tests
   */
  async runAllTests(): Promise<void> {
    console.log('\n====================================');
    console.log('MODEL SETUP AND CONFIGURATION TESTS');
    console.log('====================================\n');

    await this.testEnvironmentVariables();
    await this.testGoogleGenAI();
    await this.testHuggingFaceConfiguration();
    await this.testCloudStorageConnection();
    await this.testModelInference();
    await this.printTestResults();
  }

  /**
   * Test 1: Environment Variables
   */
  private async testEnvironmentVariables(): Promise<void> {
    const startTime = Date.now();
    const requiredEnvs = [
      'API_KEY',
      'HF_API_KEY',
      'MODEL_PROVIDER',
      'CLOUD_STORAGE_PROVIDER'
    ];

    try {
      const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
      
      if (missingEnvs.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvs.join(', ')}`);
      }

      this.results.push({
        name: 'Environment Variables',
        passed: true,
        message: 'All required environment variables are set',
        duration: Date.now() - startTime
      });
    } catch (error: any) {
      this.results.push({
        name: 'Environment Variables',
        passed: false,
        message: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  /**
   * Test 2: Google GenAI Configuration
   */
  private async testGoogleGenAI(): Promise<void> {
    const startTime = Date.now();

    try {
      if (!process.env.API_KEY) {
        throw new Error('GOOGLE API_KEY not configured');
      }

      const status = hybridService.getStatus();
      
      if (!status.googleAIReady && process.env.MODEL_PROVIDER === 'google') {
        throw new Error('Google GenAI not properly initialized');
      }

      this.results.push({
        name: 'Google GenAI Configuration',
        passed: true,
        message: `Google GenAI ${status.googleAIReady ? 'ready' : 'not primary provider'}`,
        duration: Date.now() - startTime
      });
    } catch (error: any) {
      this.results.push({
        name: 'Google GenAI Configuration',
        passed: false,
        message: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  /**
   * Test 3: Hugging Face Configuration
   */
  private async testHuggingFaceConfiguration(): Promise<void> {
    const startTime = Date.now();

    try {
      if (!process.env.HF_API_KEY) {
        throw new Error('HF_API_KEY not configured');
      }

      if (!process.env.MODEL_NAME) {
        throw new Error('MODEL_NAME not configured');
      }

      await hfService.initialize();
      const status = hfService.getModelStatus();

      this.results.push({
        name: 'Hugging Face Configuration',
        passed: status.loaded,
        message: `Model ${status.modelName} - ${status.loaded ? 'Ready' : 'Not loaded'}`,
        duration: Date.now() - startTime
      });
    } catch (error: any) {
      this.results.push({
        name: 'Hugging Face Configuration',
        passed: false,
        message: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  /**
   * Test 4: Cloud Storage Connection
   */
  private async testCloudStorageConnection(): Promise<void> {
    const startTime = Date.now();

    try {
      const provider = process.env.CLOUD_STORAGE_PROVIDER || 'google-drive';

      if (!provider) {
        throw new Error('CLOUD_STORAGE_PROVIDER not configured');
      }

      let canConnect = true;
      let message = `Cloud storage provider: ${provider}`;

      if (provider === 'google-drive') {
        if (!process.env.GOOGLE_DRIVE_FILE_ID && !process.env.MODEL_STORAGE_URL) {
          canConnect = false;
          message = 'Google Drive: FILE_ID or STORAGE_URL not configured';
        }
      } else if (provider === 's3') {
        if (!process.env.AWS_S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID) {
          canConnect = false;
          message = 'AWS S3: Missing credentials';
        }
      } else if (provider === 'dropbox') {
        if (!process.env.DROPBOX_TOKEN) {
          canConnect = false;
          message = 'Dropbox: TOKEN not configured';
        }
      }

      this.results.push({
        name: 'Cloud Storage Configuration',
        passed: canConnect,
        message: message,
        duration: Date.now() - startTime
      });
    } catch (error: any) {
      this.results.push({
        name: 'Cloud Storage Configuration',
        passed: false,
        message: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  /**
   * Test 5: Model Inference
   */
  private async testModelInference(): Promise<void> {
    const startTime = Date.now();

    try {
      const testTopic = 'artificial intelligence';
      const testContext = 'brief overview';

      const dialogue = await hybridService.generateDialogue(testTopic, testContext);

      // Validate response structure
      if (!dialogue.intro || !dialogue.discussion || !dialogue.synthesis) {
        throw new Error('Invalid dialogue structure in response');
      }

      if (!Array.isArray(dialogue.discussion) || dialogue.discussion.length === 0) {
        throw new Error('Missing discussion section in response');
      }

      this.results.push({
        name: 'Model Inference Test',
        passed: true,
        message: `Successfully generated dialogue with ${dialogue.discussion.length} speakers`,
        duration: Date.now() - startTime
      });
    } catch (error: any) {
      this.results.push({
        name: 'Model Inference Test',
        passed: false,
        message: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  /**
   * Print test results summary
   */
  private async printTestResults(): Promise<void> {
    console.log('\n====================================');
    console.log('TEST RESULTS');
    console.log('====================================\n');

    let passedCount = 0;
    let failedCount = 0;

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} | ${result.name} (${result.duration}ms)`);
      console.log(`       ${result.message}\n`);

      if (result.passed) passedCount++;
      else failedCount++;
    });

    console.log('====================================');
    console.log(`Summary: ${passedCount} passed, ${failedCount} failed`);
    console.log('====================================\n');

    if (failedCount > 0) {
      console.log('⚠️  Some tests failed. Please review the configuration.');
      console.log('📖 Check CLOUD_MODEL_INTEGRATION.md for setup instructions.\n');
    } else {
      console.log('✅ All tests passed! Your setup is ready to use.\n');
    }
  }
}

/**
 * Interactive configuration wizard
 */
async function runConfigurationWizard(): Promise<void> {
  console.log('\n====================================');
  console.log('CLOUD MODEL SETUP WIZARD');
  console.log('====================================\n');

  console.log('This wizard will help you configure your cloud-based Hugging Face model.\n');

  console.log('Step 1: Select your primary model provider');
  console.log('  1. Google GenAI (Gemini)');
  console.log('  2. Hugging Face');
  console.log('  3. Both (with fallback)\n');

  console.log('Step 2: Select your cloud storage provider');
  console.log('  1. Google Drive');
  console.log('  2. AWS S3');
  console.log('  3. Dropbox');
  console.log('  4. Skip cloud storage\n');

  console.log('Step 3: Select a model');
  console.log('  1. Mistral-7B-Instruct (recommended)');
  console.log('  2. Llama-2-7B-Chat');
  console.log('  3. Llama-2-13B-Chat');
  console.log('  4. Custom model\n');

  console.log('📝 After answering these questions, a .env template will be generated.');
  console.log('   Fill in your credentials and run tests.\n');
}

/**
 * Generate .env template based on selections
 */
function generateEnvTemplate(
  provider: string,
  storage: string,
  model: string
): string {
  let template = `# Kanespace Knowledge Base Studio Configuration\n\n`;

  // Add provider configuration
  if (provider === 'google') {
    template += `# Google GenAI Configuration\nAPI_KEY=your_google_api_key\nMODEL_PROVIDER=google\n\n`;
  } else if (provider === 'huggingface') {
    template += `# Hugging Face Configuration\nHF_API_KEY=your_huggingface_token\nMODEL_PROVIDER=huggingface\nMODEL_NAME=${model}\n\n`;
  } else {
    template += `# Hybrid Configuration\nAPI_KEY=your_google_api_key\nHF_API_KEY=your_huggingface_token\nMODEL_PROVIDER=google\nMODEL_FALLBACK_PROVIDER=huggingface\nMODEL_NAME=${model}\n\n`;
  }

  // Add storage configuration
  if (storage === 'google-drive') {
    template += `# Google Drive Configuration\nCLOUD_STORAGE_PROVIDER=google-drive\nGOOGLE_DRIVE_FILE_ID=your_file_id\nMODEL_STORAGE_URL=https://drive.google.com/uc?id=your_file_id&export=download\n\n`;
  } else if (storage === 's3') {
    template += `# AWS S3 Configuration\nCLOUD_STORAGE_PROVIDER=s3\nAWS_S3_BUCKET=your_bucket\nAWS_S3_KEY=path/to/model\nAWS_ACCESS_KEY_ID=your_access_key\nAWS_SECRET_ACCESS_KEY=your_secret_key\n\n`;
  } else if (storage === 'dropbox') {
    template += `# Dropbox Configuration\nCLOUD_STORAGE_PROVIDER=dropbox\nDROPBOX_TOKEN=your_token\nDROPBOX_PATH=/path/to/model.tar.gz\n\n`;
  }

  // Add caching and performance settings
  template += `# Caching and Performance\nMODEL_CACHE_DIR=./models\nENABLE_RESPONSE_CACHING=true\nINFERENCE_TIMEOUT=60000\n`;

  return template;
}

// Export functions
export {
  ModelSetupTester,
  runConfigurationWizard,
  generateEnvTemplate
};

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ModelSetupTester();
  tester.runAllTests().catch(console.error);
}
