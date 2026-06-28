// GSAP ScrollTrigger Integration: Pinning & Editorial Parallax Transitions
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TIMELINE } from './config/timeline.js';

gsap.registerPlugin(ScrollTrigger);

class ScrollTimeline {
  constructor() {
    this.scrollSection = null;
    this.viewportContainer = null;
    this.targetProgress = 0;
    this.scrollTriggerInstance = null;
  }

  init(scrollSectionId, viewportId) {
    this.scrollSection = document.getElementById(scrollSectionId);
    this.viewportContainer = document.getElementById(viewportId);

    // Apply scroll multiplier height to triggers
    this.scrollSection.style.height = `${TIMELINE.scrollLengthMultiplier * 100}vh`;

    // Create the Act I pinning trigger
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

    ScrollTrigger.refresh();
  }

  // Register Level 2 scroll transitions on Act II editorial sections
  initEditorialAnimations() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Select all dynamic articles
    const sections = document.querySelectorAll('.editorial-section, .editorial-footer');
    
    sections.forEach(section => {
      const fadeItems = section.querySelectorAll('.fade-up');
      if (fadeItems.length === 0) return;
      
      if (prefersReduced) {
        // Accessibility profile: fast flat opacity transition, no offsets or blur filters
        gsap.fromTo(fadeItems, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      } else {
        // Luxury profile: smooth staggering fade, translation, and subtle blur correction
        gsap.fromTo(fadeItems, {
          opacity: 0,
          y: 40,
          filter: 'blur(4px)'
        }, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Parallax image controls (Act II feature pictures)
      const parallaxImg = section.querySelector('.parallax-img');
      if (parallaxImg && !prefersReduced) {
        gsap.fromTo(parallaxImg, {
          scale: 1.05,
          yPercent: -4
        }, {
          scale: 1.00,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
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
