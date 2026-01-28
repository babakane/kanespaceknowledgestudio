import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface CloudStorageConfig {
  provider: 'google-drive' | 's3' | 'dropbox' | 'custom';
  credentials?: Record<string, string>;
  cacheDir?: string;
}

export interface CloudFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  downloadUrl: string;
}

class CloudStorageManager {
  private config: CloudStorageConfig;
  private cacheDir: string;

  constructor(config: CloudStorageConfig) {
    this.config = config;
    this.cacheDir = config.cacheDir || './cloud-cache';
    this.ensureCacheDir();
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Download file from Google Drive
   * 
   * @param fileId Google Drive file ID
   * @param fileName Local file name to save as
   * @returns Path to downloaded file
   */
  async downloadFromGoogleDrive(fileId: string, fileName: string): Promise<string> {
    try {
      const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
      return await this.downloadFile(downloadUrl, fileName);
    } catch (error) {
      console.error('Error downloading from Google Drive:', error);
      throw error;
    }
  }

  /**
   * Download file from AWS S3
   * 
   * @param bucket S3 bucket name
   * @param key S3 object key
   * @param fileName Local file name to save as
   * @returns Path to downloaded file
   */
  async downloadFromS3(bucket: string, key: string, fileName: string): Promise<string> {
    try {
      if (!this.config.credentials?.AWS_ACCESS_KEY_ID) {
        throw new Error('AWS credentials not configured');
      }

      const downloadUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      return await this.downloadFile(downloadUrl, fileName);
    } catch (error) {
      console.error('Error downloading from S3:', error);
      throw error;
    }
  }

  /**
   * Download file from Dropbox
   * 
   * @param dropboxPath Path in Dropbox (e.g., /Models/model.tar.gz)
   * @param fileName Local file name to save as
   * @returns Path to downloaded file
   */
  async downloadFromDropbox(dropboxPath: string, fileName: string): Promise<string> {
    try {
      if (!this.config.credentials?.DROPBOX_TOKEN) {
        throw new Error('Dropbox token not configured');
      }

      const downloadUrl = `https://content.dropboxapi.com/2/files/download`;
      const filePath = path.join(this.cacheDir, fileName);

      const response = await axios.post(
        downloadUrl,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.config.credentials.DROPBOX_TOKEN}`,
            'Dropbox-API-Arg': JSON.stringify({ path: dropboxPath })
          },
          responseType: 'arraybuffer',
          timeout: 300000
        }
      );

      fs.writeFileSync(filePath, response.data);
      console.log(`File downloaded from Dropbox: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error downloading from Dropbox:', error);
      throw error;
    }
  }

  /**
   * Download file from custom URL
   * 
   * @param url Full download URL
   * @param fileName Local file name to save as
   * @returns Path to downloaded file
   */
  async downloadFromCustomURL(url: string, fileName: string): Promise<string> {
    try {
      return await this.downloadFile(url, fileName);
    } catch (error) {
      console.error('Error downloading from custom URL:', error);
      throw error;
    }
  }

  /**
   * Generic file download method
   */
  private async downloadFile(url: string, fileName: string): Promise<string> {
    try {
      const filePath = path.join(this.cacheDir, fileName);

      // Check if file already cached
      if (fs.existsSync(filePath)) {
        console.log(`File already cached: ${filePath}`);
        return filePath;
      }

      console.log(`Downloading: ${url}`);
      
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 600000, // 10 minutes
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Download progress: ${percentCompleted}%`);
          }
        }
      });

      // Write file to cache
      fs.writeFileSync(filePath, response.data);
      console.log(`File downloaded: ${filePath}`);
      
      return filePath;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Extract downloaded archive
   * 
   * @param archivePath Path to tar.gz or zip file
   * @param extractDir Directory to extract to
   */
  async extractArchive(archivePath: string, extractDir?: string): Promise<string> {
    try {
      const targetDir = extractDir || path.join(this.cacheDir, 'extracted');
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Dynamic import to avoid hard dependency
      if (archivePath.endsWith('.tar.gz')) {
        const tar = await import('tar');
        await tar.extract({
          file: archivePath,
          cwd: targetDir
        });
      } else if (archivePath.endsWith('.zip')) {
        const unzipper = await import('unzipper');
        fs.createReadStream(archivePath)
          .pipe(unzipper.Extract({ path: targetDir }));
      } else {
        throw new Error('Unsupported archive format. Use .tar.gz or .zip');
      }

      console.log(`Archive extracted to: ${targetDir}`);
      return targetDir;
    } catch (error) {
      console.error('Error extracting archive:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    cacheDir: string;
    totalSize: number;
    fileCount: number;
    files: string[];
  } {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let totalSize = 0;

      files.forEach(file => {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });

      return {
        cacheDir: this.cacheDir,
        totalSize,
        fileCount: files.length,
        files
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        cacheDir: this.cacheDir,
        totalSize: 0,
        fileCount: 0,
        files: []
      };
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    try {
      if (fs.existsSync(this.cacheDir)) {
        fs.rmSync(this.cacheDir, { recursive: true });
        this.ensureCacheDir();
        console.log('Cache cleared');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Get file from cache if it exists
   */
  getFromCache(fileName: string): string | null {
    const filePath = path.join(this.cacheDir, fileName);
    return fs.existsSync(filePath) ? filePath : null;
  }

  /**
   * List all cached files with details
   */
  listCachedFiles(): Array<{
    name: string;
    path: string;
    size: number;
    modified: Date;
  }> {
    try {
      const files = fs.readdirSync(this.cacheDir);
      return files.map(file => {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          modified: stats.mtime
        };
      });
    } catch (error) {
      console.error('Error listing cached files:', error);
      return [];
    }
  }
}

// Export singleton for Google Drive (most common case)
export const googleDriveManager = new CloudStorageManager({
  provider: 'google-drive'
});

export default CloudStorageManager;
