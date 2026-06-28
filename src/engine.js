// Canvas Rendering Engine with Frame Interpolation and Aspect-Ratio Locking
import { CONFIG } from './config.js';
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
    
    // Bounds of the rendered image within the canvas (in layout pixels)
    this.renderBounds = { x: 0, y: 0, w: 0, h: 0 };
  }

  init(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { alpha: false }); // Disable alpha for max performance
    this.container = document.getElementById(containerId);
    this.svgOverlay = document.getElementById('svg-overlay');
    this.calloutsContainer = document.getElementById('callouts-container');

    // Watch for window resize and resize canvas appropriately
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);

    this.resize();
  }

  resize() {
    if (!this.canvas || !this.container) return;

    // Viewport dimensions (full window width/height)
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set buffer dimensions matching full hardware resolution
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    // Canvas layout takes full viewport
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Design coordinates are 16:9
    const targetAspect = CONFIG.frames.width / CONFIG.frames.height;
    const containerAspect = rect.width / rect.height;
    
    let w, h;
    
    // Fit aspect ratio inside viewport (contain algorithm)
    if (containerAspect > targetAspect) {
      // Screen is wider than 16:9 (e.g. desktop widescreen)
      h = rect.height;
      w = h * targetAspect;
    } else {
      // Screen is taller than 16:9 (e.g. mobile portrait)
      w = rect.width;
      h = w / targetAspect;
    }

    // Centered coordinates of the rendered image in layout pixels
    const x = (rect.width - w) / 2;
    const y = (rect.height - h) / 2;

    this.renderBounds = { x, y, w, h };

    // Sync SVG overlay and callout container sizes to the exact rendered region
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
    document.documentElement.style.setProperty('--device-pixel-ratio', `${dpr}`);

    // Re-render current frame immediately to avoid flickering during resize
    if (this.lastRenderedFrame !== -1) {
      this.draw(this.lastRenderedFrame, true);
    }
  }

  // Draw frame with fractional frame index crossfade
  draw(frameProgress, forceRedraw = false) {
    if (!this.ctx || !this.canvas) return;

    // Force progress bounds
    const frameIndex = Math.min(CONFIG.frames.total, Math.max(1, frameProgress));

    // Optimize: Skip redraw if frame progress didn't change enough to affect pixels
    if (!forceRedraw && Math.abs(this.lastRenderedFrame - frameIndex) < 0.005) {
      return;
    }

    this.lastRenderedFrame = frameIndex;

    const dpr = window.devicePixelRatio || 1;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    // Clear with black for clean borders if screen aspect ratio does not match 16:9
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, cw, ch);

    // Calculate dimensions in hardware pixels
    const rx = this.renderBounds.x * dpr;
    const ry = this.renderBounds.y * dpr;
    const rw = this.renderBounds.w * dpr;
    const rh = this.renderBounds.h * dpr;

    // Separate integer and fractional component
    const floorFrame = Math.floor(frameIndex);
    const ceilFrame = Math.min(CONFIG.frames.total, floorFrame + 1);
    const fraction = frameIndex - floorFrame;

    const imgFloor = preloader.getImage(floorFrame);
    const imgCeil = preloader.getImage(ceilFrame);

    if (!imgFloor) return; // Wait for assets to load

    // Draw base floor frame
    this.ctx.globalAlpha = 1.0;
    this.ctx.drawImage(imgFloor, rx, ry, rw, rh);

    // Blended crossfade interpolation overlay
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
