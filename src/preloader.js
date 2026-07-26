import { TIMELINE } from './config/timeline.js';

class ImagePreloader {
  constructor() {
    this.images = [];
    this.loadedCount = 0;
    this.totalCount = TIMELINE.frames.total;
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
    return `${TIMELINE.frames.basePath}${pad}${TIMELINE.frames.extension}`;
  }

  // Background-load all other images and decode them in controlled batches
  async loadRemaining() {
    const batchSize = 4;
    
    for (let i = 2; i <= this.totalCount; i += batchSize) {
      const batchPromises = [];
      
      for (let j = 0; j < batchSize && (i + j) <= this.totalCount; j++) {
        const frameIdx = i + j;
        const p = new Promise((resolve) => {
          const img = new Image();
          img.src = this.getFramePath(frameIdx);
          
          img.onload = async () => {
            this.images[frameIdx - 1] = img;
            this.loadedCount++;
            
            if (this.onProgress) {
              this.onProgress(this.loadedCount / this.totalCount);
            }

            // Pre-decode on GPU to avoid main thread jank
            try {
              if (typeof img.decode === 'function') {
                await img.decode();
              }
            } catch (e) {
              // Silently handle cancelled decodes
            }
            resolve(img);
          };

          img.onerror = () => {
            console.error(`Failed to load frame ${frameIdx}`);
            resolve(null);
          };
        });
        batchPromises.push(p);
      }
      
      await Promise.all(batchPromises);
    }
    
    if (this.onAllLoaded) {
      this.onAllLoaded(this.images);
    }
  }

  // Get cached image by index (1-based), falling back to nearest loaded frame to prevent blank canvas states
  getImage(index) {
    const idx = Math.min(this.totalCount - 1, Math.max(0, index - 1));
    
    // Ideal case: return requested frame
    if (this.images[idx]) {
      return this.images[idx];
    }
    
    // Fallback case 1: search backwards for closest loaded frame
    for (let i = idx - 1; i >= 0; i--) {
      if (this.images[i]) {
        return this.images[i];
      }
    }
    
    // Fallback case 2: search forwards
    for (let i = idx + 1; i < this.totalCount; i++) {
      if (this.images[i]) {
        return this.images[i];
      }
    }
    
    return null;
  }
}

export const preloader = new ImagePreloader();
