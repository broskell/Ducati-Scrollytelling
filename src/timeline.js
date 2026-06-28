// Scroll Pinning and GSAP ScrollTrigger Integration
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG } from './config.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class ScrollTimeline {
  constructor() {
    this.scrollSection = null;
    this.viewportContainer = null;
    this.targetProgress = 0; // Target scroll progress [0, 1]
    this.scrollTriggerInstance = null;
  }

  init(scrollSectionId, viewportId) {
    this.scrollSection = document.getElementById(scrollSectionId);
    this.viewportContainer = document.getElementById(viewportId);

    // Set scroll height dynamically based on configuration multiplier
    this.scrollSection.style.height = `${CONFIG.animation.scrollMultiplier * 100}vh`;

    // Create the pinning trigger
    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: this.scrollSection,
      start: 'top top',
      end: 'bottom bottom',
      pin: this.viewportContainer,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: true,
      onUpdate: (self) => {
        this.targetProgress = self.progress;
      }
    });

    // Refresh GSAP on init to compute heights correctly
    ScrollTrigger.refresh();
  }

  getProgress() {
    return this.targetProgress;
  }

  cleanup() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
  }
}

export const scrollTimeline = new ScrollTimeline();
