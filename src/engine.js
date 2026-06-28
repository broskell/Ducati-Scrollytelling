// Canvas Rendering Engine: Aspect-Locked Buffer & Responsive Composition
import { TIMELINE } from './config/timeline.js';
import { LAYOUT } from './config/layout.js';
import { MOTION } from './config/motion.js';
import { preloader } from './preloader.js';

class CanvasEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.svgOverlay = null;
    this.calloutsContainer = null;
    this.lastRenderedFrame = -1;
    this.resizeObserver = null;
    
    // Stabilized virtual camera values
    this.currentScale = null;
    this.currentOffsetX = null;
    this.activeProfileName = 'desktop';
    
    // Bounds of the rendered image within the canvas (in layout pixels)
    this.renderBounds = { x: 0, y: 0, w: 0, h: 0 };
  }

  init(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { alpha: false }); // Max performance
    this.container = document.getElementById(containerId);
    this.svgOverlay = document.getElementById('svg-overlay');
    this.calloutsContainer = document.getElementById('callouts-container');

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);

    this.resize();
  }

  resize() {
    if (!this.canvas || !this.container) return;

    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set hardware buffer resolution
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    document.documentElement.style.setProperty('--device-pixel-ratio', `${dpr}`);

    // Re-render immediately on resize
    if (this.lastRenderedFrame !== -1) {
      this.draw(this.lastRenderedFrame, true);
    }
  }

  // Calculate target composition scale and offset based on viewport and frame status
  getComposition(frameIndex, viewportW, viewportH) {
    const profile = LAYOUT.getProfile(viewportW);
    this.activeProfileName = profile.name;

    // Define motorcycle bounds in design pixels (1280x720)
    let bw, bh;
    if (frameIndex <= 7 || frameIndex >= 31) {
      bw = 920;  // Assembled bike bounds
      bh = 510;
    } else if (frameIndex >= 24 && frameIndex <= 27) {
      bw = 1180; // Exploded bike bounds
      bh = 630;
    } else {
      // Interpolate bounds smoothly as components split
      let p;
      if (frameIndex < 24) {
        p = (frameIndex - 7) / (24 - 7);
      } else {
        p = (31 - frameIndex) / (31 - 27);
      }
      bw = 920 + p * (1180 - 920);
      bh = 510 + p * (630 - 510);
    }

    // Interpolate target viewport occupancy percentage
    let targetOccupancy;
    if (frameIndex <= 7 || frameIndex >= 31) {
      targetOccupancy = profile.occupancyHero;
    } else if (frameIndex >= 24 && frameIndex <= 27) {
      targetOccupancy = profile.occupancyExploded;
    } else {
      let p;
      if (frameIndex < 24) {
        p = (frameIndex - 7) / (24 - 7);
      } else {
        p = (31 - frameIndex) / (31 - 27);
      }
      targetOccupancy = profile.occupancyHero - p * (profile.occupancyHero - profile.occupancyExploded);
    }

    // Compute target scale to fit target width occupancy
    let targetScale = (viewportW * targetOccupancy) / bw;

    // SOFT EDGE PROTECTION: Verify vertical constraints (clipping top/bottom)
    const maxHeight = viewportH * (1 - 2 * profile.safeMarginY);
    if (bh * targetScale > maxHeight) {
      targetScale = maxHeight / bh;
    }

    // Verify horizontal constraints (clipping left/right)
    const maxWidth = viewportW * (1 - 2 * profile.safeMarginX);
    if (bw * targetScale > maxWidth) {
      targetScale = maxWidth / bw;
    }

    // Horizontal offset to the right (leaves breathing space in front of bike)
    const targetOffsetX = viewportW * profile.offsetX;

    return {
      scale: targetScale,
      offsetX: targetOffsetX
    };
  }

  draw(frameProgress, forceRedraw = false) {
    if (!this.ctx || !this.canvas || !this.container) return;

    const frameIndex = Math.min(TIMELINE.frames.total, Math.max(1, frameProgress));

    // Optimize: Skip drawing if frame state didn't modify pixel offsets
    if (!forceRedraw && Math.abs(this.lastRenderedFrame - frameIndex) < 0.005) {
      return;
    }

    this.lastRenderedFrame = frameIndex;

    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    // 1. Get raw target composition values
    const targetComp = this.getComposition(frameIndex, rect.width, rect.height);

    // 2. Initialize or Lerp camera values
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerpSpeed = prefersReduced ? MOTION.lerpFactorReduced : MOTION.lerpFactor;

    if (this.currentScale === null) {
      this.currentScale = targetComp.scale;
      this.currentOffsetX = targetComp.offsetX;
    } else {
      this.currentScale += (targetComp.scale - this.currentScale) * lerpSpeed;
      this.currentOffsetX += (targetComp.offsetX - this.currentOffsetX) * lerpSpeed;
    }

    // 3. Compute layout dimensions
    const w = 1280 * this.currentScale;
    const h = 720 * this.currentScale;

    // Center canvas in viewport and apply composition offset to the right
    const x = (rect.width - w) / 2 + this.currentOffsetX;
    const y = (rect.height - h) / 2;

    this.renderBounds = { x, y, w, h };

    // 4. Synchronize HTML overlay bounds directly to coordinate source of truth
    if (this.svgOverlay) {
      this.svgOverlay.style.width = `${w}px`;
      this.svgOverlay.style.height = `${h}px`;
      this.svgOverlay.style.left = `${x}px`;
      this.svgOverlay.style.top = `${y}px`;
    }

    if (this.calloutsContainer) {
      this.calloutsContainer.style.width = `${w}px`;
      this.calloutsContainer.style.height = `${h}px`;
      this.calloutsContainer.style.left = `${x}px`;
      this.calloutsContainer.style.top = `${y}px`;
    }

    document.documentElement.style.setProperty('--canvas-width', `${w}px`);
    document.documentElement.style.setProperty('--canvas-height', `${h}px`);

    // 5. Drawing phase
    // Clear canvas bounds with solid black
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, cw, ch);

    // Calculate dimensions in hardware resolution coordinates
    const rx = x * dpr;
    const ry = y * dpr;
    const rw = w * dpr;
    const rh = h * dpr;

    const floorFrame = Math.floor(frameIndex);
    const ceilFrame = Math.min(TIMELINE.frames.total, floorFrame + 1);
    const fraction = frameIndex - floorFrame;

    const imgFloor = preloader.getImage(floorFrame);
    const imgCeil = preloader.getImage(ceilFrame);

    if (!imgFloor) return;

    // Draw base frame
    this.ctx.globalAlpha = 1.0;
    this.ctx.drawImage(imgFloor, rx, ry, rw, rh);

    // Blended crossfade interpolation
    if (fraction > 0.005 && imgCeil && floorFrame !== ceilFrame) {
      this.ctx.globalAlpha = fraction;
      this.ctx.drawImage(imgCeil, rx, ry, rw, rh);
    }

    // Reset alpha
    this.ctx.globalAlpha = 1.0;
  }

  cleanup() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

export const engine = new CanvasEngine();
