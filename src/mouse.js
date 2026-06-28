// Mouse Interaction: Subtle Camera Drift and Studio Spotlight Sweeps
import { MOTION } from './config/motion.js';

class MouseInteraction {
  constructor() {
    this.canvasWrapper = null;
    
    // Mouse coords (-0.5 to 0.5)
    this.mouseX = 0;
    this.mouseY = 0;
    
    // Lerped camera drift coordinates
    this.currentDriftX = 0;
    this.currentDriftY = 0;
    this.targetDriftX = 0;
    this.targetDriftY = 0;

    // Lerped spotlight positions (percentages)
    this.currentLightX = 50;
    this.currentLightY = 50;
    this.targetLightX = 50;
    this.targetLightY = 50;

    this.active = false;
    this.boundOnMouseMove = this.onMouseMove.bind(this);
  }

  init(canvasWrapperId) {
    this.canvasWrapper = document.getElementById(canvasWrapperId);
    
    // Bind global move listener
    window.addEventListener('mousemove', this.boundOnMouseMove, { passive: true });
    
    this.active = true;
    this.tick();
  }

  onMouseMove(e) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Normalize coordinates from -0.5 to 0.5 relative to screen center
    this.mouseX = (e.clientX / w) - 0.5;
    this.mouseY = (e.clientY / h) - 0.5;

    // Set target positions
    this.targetDriftX = this.mouseX * MOTION.mouseDriftX * 2; // e.g. -3.5px to 3.5px
    this.targetDriftY = this.mouseY * MOTION.mouseDriftY * 2; // e.g. -2px to 2px

    // Spotlight sweeps within 35% - 65% of screen
    this.targetLightX = 50 + (this.mouseX * 30);
    this.targetLightY = 50 + (this.mouseY * 30);
  }

  tick() {
    if (!this.active) return;

    // Continuous tick animation loop
    requestAnimationFrame(() => this.tick());

    // Lerp drift coordinates
    const lerpFactor = 0.05; // slow dampening for heavy physical feel
    this.currentDriftX += (this.targetDriftX - this.currentDriftX) * lerpFactor;
    this.currentDriftY += (this.targetDriftY - this.currentDriftY) * lerpFactor;

    // Apply translate3d to canvas wrapper
    if (this.canvasWrapper) {
      this.canvasWrapper.style.transform = `translate3d(${this.currentDriftX}px, ${this.currentDriftY}px, 0)`;
    }

    // Lerp spotlight gradients
    this.currentLightX += (this.targetLightX - this.currentLightX) * lerpFactor;
    this.currentLightY += (this.targetLightY - this.currentLightY) * lerpFactor;

    // Write positions into CSS custom variables
    document.documentElement.style.setProperty('--light-x', `${this.currentLightX}%`);
    document.documentElement.style.setProperty('--light-y', `${this.currentLightY}%`);
  }

  cleanup() {
    this.active = false;
    window.removeEventListener('mousemove', this.boundOnMouseMove);
  }
}

export const mouseInteraction = new MouseInteraction();
