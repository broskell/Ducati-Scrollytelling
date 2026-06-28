// Image preloading and caching system
import { CONFIG } from './config.js';

class ImagePreloader {
  constructor() {
    this.images = [];
    this.loadedCount = 0;
    this.totalCount = CONFIG.frames.total;
    this.onFrame1Loaded = null;
    this.onAllLoaded = null;
    this.onProgress = null;
  }

  // Load Frame 1 immediately, then background-load other frames
  init(onFrame1Loaded, onProgress, onAllLoaded) {
    this.onFrame1Loaded = onFrame1Loaded;
    this.onProgress = onProgress;
    this.onAllLoaded = onAllLoaded;

    // Load Frame 1 first
    const frame1Path = this.getFramePath(1);
    const img1 = new Image();
    img1.src = frame1Path;
    
    img1.onload = async () => {
      this.images[0] = img1;
      this.loadedCount++;
      
      // Attempt to decode frame 1 immediately
      try {
        await img1.decode();
      } catch (e) {
        console.warn('Frame 1 decode skipped: ', e);
      }
      
      // Execute the callback to paint frame 1 instantly
      if (this.onFrame1Loaded) {
        this.onFrame1Loaded(img1);
      }

      // Progress callback
      if (this.onProgress) {
        this.onProgress(this.loadedCount / this.totalCount);
      }

      // Load remaining frames in the background
      this.loadRemaining();
    };

    img1.onerror = (err) => {
      console.error('Failed to load Frame 1:', err);
    };
  }

  // Format frame index to zero-padded naming convention (e.g. 001 to 051)
  getFramePath(index) {
    const pad = String(index).padStart(3, '0');
    return `${CONFIG.frames.basePath}${pad}${CONFIG.frames.extension}`;
  }

  // Background-load all other images and decode them
  async loadRemaining() {
    const loadPromises = [];

    for (let i = 2; i <= this.totalCount; i++) {
      const p = new Promise((resolve) => {
        const img = new Image();
        img.src = this.getFramePath(i);
        
        img.onload = async () => {
          this.images[i - 1] = img;
          this.loadedCount++;
          
          if (this.onProgress) {
            this.onProgress(this.loadedCount / this.totalCount);
          }

          // Pre-decode on GPU
          try {
            if (typeof img.decode === 'function') {
              await img.decode();
            }
          } catch (e) {
            // Silently handle cases where browser cancels decodes due to frame sweeps
          }
          resolve(img);
        };

        img.onerror = () => {
          console.error(`Failed to load frame ${i}`);
          resolve(null);
        };
      });
      loadPromises.push(p);
    }

    await Promise.all(loadPromises);
    
    if (this.onAllLoaded) {
      this.onAllLoaded(this.images);
    }
  }

  // Get cached image by index (1-based)
  getImage(index) {
    const idx = Math.min(this.totalCount - 1, Math.max(0, index - 1));
    return this.images[idx];
  }
}

export const preloader = new ImagePreloader();
