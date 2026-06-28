// Main Orchestration & Rendering Tick Loop
import { CONFIG } from './config.js';
import { preloader } from './preloader.js';
import { engine } from './engine.js';
import { scrollTimeline } from './timeline.js';
import { calloutSystem } from './callouts.js';
import { mouseInteraction } from './mouse.js';

class Application {
  constructor() {
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.lerpFactor = CONFIG.animation.lerpFactor;
    this.activeTextId = null;
    this.fallbackImg = null;
    this.progressFill = null;
    this.progressVal = null;
    this.initialized = false;
  }

  init() {
    this.fallbackImg = document.getElementById('fallback-img');
    this.progressFill = document.getElementById('progress-fill');
    this.progressVal = document.getElementById('progress-val');

    // Step 1: Preload assets
    // Instantly loads frame 1, paints it, then background decodes remaining frames
    preloader.init(
      // Frame 1 Loaded (paint instantly)
      (img1) => this.paintInitialFrame(img1),
      // Progress update (optional debug logging)
      (pct) => this.onPreloadProgress(pct),
      // All Loaded
      (images) => this.onAssetsLoaded()
    );
  }

  // Draw Frame 1 as soon as it arrives, hiding the static placeholder image
  paintInitialFrame(img1) {
    engine.init('scrolly-canvas', 'canvas-wrapper');
    engine.draw(1, true); // paint frame 1 immediately
    
    // Hide fallback image since canvas is active
    if (this.fallbackImg) {
      this.fallbackImg.classList.add('hidden');
    }
  }

  onPreloadProgress(pct) {
    // We run loading silent in background to maintain instant start vision,
    // but log for developers in console.
    console.log(`Chassis Assets preloading: ${Math.round(pct * 100)}%`);
  }

  // Once all assets are loaded and GPU decoded, start core systems
  onAssetsLoaded() {
    console.log('Chassis Systems Ready.');
    
    // Initialize systems
    scrollTimeline.init('scrolly-section', 'viewport');
    calloutSystem.init('callouts-container', 'svg-overlay', 'scrolly-canvas');
    mouseInteraction.init('canvas-wrapper');

    this.initialized = true;
    
    // Start continuous tick loop
    this.tick();
  }

  // Smooth lerped animation loop
  tick() {
    if (!this.initialized) return;
    
    requestAnimationFrame(() => this.tick());

    // 1. Read target progress from GSAP/ScrollTrigger
    this.targetProgress = scrollTimeline.getProgress();

    // 2. Lerp the progress values for smooth momentum
    this.currentProgress += (this.targetProgress - this.currentProgress) * this.lerpFactor;

    // Avoid tiny floating decimal updates when stationary
    if (Math.abs(this.targetProgress - this.currentProgress) < 0.0001) {
      this.currentProgress = this.targetProgress;
    }

    // 3. Map progress (0 to 1) to frame numbers (1 to 51)
    const frameIndex = 1 + this.currentProgress * (CONFIG.frames.total - 1);

    // 4. Render canvas interpolated frames
    engine.draw(frameIndex);

    // 5. Update component callouts trigger ranges
    calloutSystem.update(frameIndex);

    // 6. Update text chapters based on scroll progress
    this.updateChapters(this.currentProgress);

    // 7. Update minimal scroll progress bar UI
    this.updateProgressUI(this.currentProgress);
  }

  updateChapters(progress) {
    let activeCh = null;

    // Find current chapter
    for (const ch of CONFIG.chapters) {
      if (progress >= ch.scrollStart && progress <= ch.scrollEnd) {
        activeCh = ch;
        break;
      }
    }

    if (activeCh && activeCh.textElementId !== this.activeTextId) {
      // Deactivate current text block
      if (this.activeTextId) {
        const prevEl = document.getElementById(this.activeTextId);
        if (prevEl) prevEl.classList.remove('active');
      }

      // Activate next text block
      this.activeTextId = activeCh.textElementId;
      const nextEl = document.getElementById(this.activeTextId);
      if (nextEl) nextEl.classList.add('active');
    }
  }

  updateProgressUI(progress) {
    const pct = Math.round(progress * 100);
    
    if (this.progressFill) {
      this.progressFill.style.width = `${pct}%`;
    }
    
    if (this.progressVal) {
      this.progressVal.textContent = `${String(pct).padStart(2, '0')}%`;
    }
  }
}

// Instantiate and start
const app = new Application();
document.addEventListener('DOMContentLoaded', () => app.init());
