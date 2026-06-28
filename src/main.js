// Main Orchestrator, Design System Injector, and Dynamic Renderer
import { TIMELINE } from './config/timeline.js';
import { LAYOUT } from './config/layout.js';
import { MOTION } from './config/motion.js';
import { COLORS } from './config/colors.js';
import { TYPOGRAPHY } from './config/typography.js';
import { CALLOUTS } from './config/callouts.js';
import { preloader } from './preloader.js';
import { engine } from './engine.js';
import { scrollTimeline } from './timeline.js';
import { calloutSystem } from './callouts.js';
import { mouseInteraction } from './mouse.js';
import { editorialSections } from './content/editorial.js';

class Application {
  constructor() {
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.activeSceneId = null;
    this.initialized = false;
    
    // Developer debug properties
    this.debugMode = false;
    this.debugEl = null;
    this.lastFpsTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
    
    // Stats count-up activation flags
    this.statsTriggered = {
      scene6: false,
      scene9: false
    };
  }

  init() {
    // 1. Inject design system tokens into CSS :root (Single Source of Truth)
    this.injectDesignTokens();

    // 2. Render Act II editorial articles dynamically from database
    this.renderActII();

    // 3. Setup dev-only runtime debug triggers
    this.initDebugOverlay();

    // 4. Preload frame assets and begin Act I canvas engine
    preloader.init(
      (img1) => this.paintInitialFrame(img1),
      (pct) => this.onPreloadProgress(pct),
      (images) => this.onAssetsLoaded()
    );
  }

  injectDesignTokens() {
    const root = document.documentElement;

    // Inject Colors
    for (const [key, val] of Object.entries(COLORS)) {
      const cssKey = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, val);
    }

    // Inject Typography Scales
    for (const [key, val] of Object.entries(TYPOGRAPHY.scale)) {
      const cssKey = `--font-size-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, val);
    }

    // Inject Motion Durations
    for (const [key, val] of Object.entries(MOTION.durations)) {
      const cssKey = `--duration-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, `${val}s`);
    }

    // Inject Z-Index Layers
    root.style.setProperty('--z-background', '-2');
    root.style.setProperty('--z-gradient', '-1');
    root.style.setProperty('--z-canvas', '2');
    root.style.setProperty('--z-spotlight', '3');
    root.style.setProperty('--z-overlay', '4');
    root.style.setProperty('--z-callouts', '5');
    root.style.setProperty('--z-editorial', '6');
    root.style.setProperty('--z-progress', '7');
    root.style.setProperty('--z-modal', '8');
  }

  // Dynamic Level 2 Editorial Renderer (Act II Content Presentation)
  renderActII() {
    const root = document.getElementById('editorial-root');
    if (!root) return;

    // Clear static Level 1 fallback copy
    root.innerHTML = '';

    // Loop and generate elements dynamically from database
    editorialSections.forEach(section => {
      const article = document.createElement('article');
      article.className = `editorial-section ${section.type}-section`;
      article.id = section.id;

      let contentHTML = '';

      if (section.type === 'centered-text') {
        contentHTML = `
          <div class="editorial-container fade-up">
            ${section.meta ? `<span class="scene-accent">${section.meta}</span>` : ''}
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="premium-sub">${section.subtitle}</h3>
            <p class="scene-narrative">${section.body}</p>
          </div>
        `;
      } else if (section.type === 'left-aligned-narrative') {
        contentHTML = `
          <div class="editorial-container fade-up" style="max-width: 800px; align-self: flex-start; padding-left: var(--space-xl);">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <p class="scene-narrative">${section.body}</p>
          </div>
        `;
      } else if (section.type === 'banner') {
        // First image uses eager loading & high priority. Subsequent images use lazy loading
        const isFirst = section.id === 'editorial-hero-banner';
        contentHTML = `
          <div class="editorial-container fade-up" style="max-width: 100%; padding-inline: 0;">
            <div class="media-col" style="aspect-ratio: 21/9; border-radius: 0; border: none;">
              <img class="parallax-img" src="${section.image}" 
                   ${isFirst ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
                   decoding="async" alt="${section.title}" width="1600" height="900">
            </div>
          </div>
        `;
      } else if (section.type === 'feature-block') {
        const imageTag = `<img class="parallax-img" src="${section.image}" loading="lazy" decoding="async" alt="${section.title}" width="800" height="600" style="aspect-ratio: 4/3; width: 100%; height: auto;">`;
        
        const textContent = `
          <div class="split-col text-col">
            ${section.meta ? `<span class="scene-accent">${section.meta}</span>` : ''}
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="premium-sub">${section.subtitle}</h3>
            <p class="scene-narrative">${section.body}</p>
          </div>
        `;

        if (section.alignment === 'left') {
          contentHTML = `
            <div class="editorial-container split-block fade-up">
              <div class="split-col media-col">${imageTag}</div>
              ${textContent}
            </div>
          `;
        } else {
          contentHTML = `
            <div class="editorial-container split-block fade-up">
              ${textContent}
              <div class="split-col media-col">${imageTag}</div>
            </div>
          `;
        }
      } else if (section.type === 'split-dashboard') {
        const imageTag = `<img class="parallax-img" src="${section.image}" loading="lazy" decoding="async" alt="${section.title}" width="800" height="600" style="aspect-ratio: 4/3; width: 100%; height: auto;">`;
        
        const textContent = `
          <div class="split-col text-col">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <p class="scene-narrative">${section.body}</p>
            <div class="stats-panel-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px;">
              ${section.specs.map(spec => `
                <div class="dashboard-spec-card">
                  <div class="spec-card-num" style="font-size: clamp(1.6rem, 2.5vw, 2.4rem); font-family: var(--font-serif); color: var(--color-text-primary); margin-bottom: 6px;">${spec.num}</div>
                  <div class="spec-card-label" style="font-size: 8px; letter-spacing: 2px; color: var(--color-text-secondary); text-transform: uppercase;">${spec.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        if (section.alignment === 'left') {
          contentHTML = `
            <div class="editorial-container split-block fade-up">
              <div class="split-col media-col">${imageTag}</div>
              ${textContent}
            </div>
          `;
        } else {
          contentHTML = `
            <div class="editorial-container split-block fade-up">
              ${textContent}
              <div class="split-col media-col">${imageTag}</div>
            </div>
          `;
        }
      } else if (section.type === 'centered-diagram') {
        contentHTML = `
          <div class="editorial-container fade-up">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <p class="scene-narrative">${section.body}</p>
            <div class="vector-overlay">
              <svg class="wind-lines" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; stroke: rgba(255,255,255,0.08); stroke-width: 1.5; margin-top: var(--space-xs);">
                <path d="M 0,50 C 200,50 300,30 400,30 C 500,30 600,60 800,60" />
                <path d="M 0,100 C 250,100 350,120 450,120 C 550,120 650,80 800,80" />
                <path d="M 0,150 C 200,150 300,160 400,160 C 550,160 600,110 800,110" />
              </svg>
            </div>
          </div>
        `;
      } else if (section.type === 'materials-grid') {
        contentHTML = `
          <div class="editorial-container fade-up">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <p class="scene-narrative-short">${section.body}</p>
            <div class="stats-panel-grid">
              ${section.materials.map(mat => `
                <div class="tech-card">
                  <h4 class="tech-card-title">${mat.name}</h4>
                  <p class="tech-card-text">${mat.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (section.type === 'electronics-grid') {
        contentHTML = `
          <div class="editorial-container fade-up">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <p class="scene-narrative-short">${section.body}</p>
            <div class="electronics-cards-grid">
               ${section.cards.map(card => `
                 <div class="tech-card">
                   <div class="tech-card-icon">${card.icon}</div>
                   <h4 class="tech-card-title">${card.title}</h4>
                   <p class="tech-card-text">${card.text}</p>
                 </div>
               `).join('')}
            </div>
          </div>
        `;
      } else if (section.type === 'heritage-timeline') {
        contentHTML = `
          <div class="editorial-container fade-up">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <div class="timeline-visual-container">
              <div class="timeline-slider-line"></div>
              <div class="timeline-years-grid">
                ${section.timeline.map(node => `
                  <div class="timeline-node active">
                    <span class="timeline-year">${node.year}</span>
                    <span class="timeline-event">${node.event}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      } else if (section.type === 'specs-grid') {
        contentHTML = `
          <div class="editorial-container fade-up">
            <h2 class="editorial-title">${section.title}</h2>
            <h3 class="scene-accent">${section.subtitle}</h3>
            <div class="specs-table-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 32px; width: 100%;">
              ${section.specs.map(spec => `
                <div class="spec-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
                  <span class="spec-label" style="color: var(--color-text-secondary); font-size: 13px;">${spec.label}</span>
                  <span class="spec-value" style="color: var(--color-text-primary); font-size: 13px; font-weight: 500;">${spec.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (section.type === 'centered-quote') {
        contentHTML = `
          <div class="editorial-container fade-up">
            <h2 class="editorial-title">${section.title}</h2>
            <p class="scene-narrative italic max-width">${section.body}</p>
          </div>
        `;
      }

      article.innerHTML = contentHTML;
      root.appendChild(article);
    });

    // Render Minimalist Footer (Act II Finale)
    const footer = document.createElement('footer');
    footer.className = 'editorial-footer fade-up';
    footer.innerHTML = `
      <div class="footer-divider"></div>
      <h1 class="footer-title">DESMOSEDICI</h1>
      <h2 class="footer-subtitle">Engineered Without Compromise.</h2>
      <p class="footer-paragraph">Ducati design and engineering represents an absolute commitment to performance, where every surface, tolerance, and component serves to enhance mechanical flow. The Desmosedici Stradale remains a testament to what is possible when form follows function at 300 kilometers per hour.</p>
    `;
    root.appendChild(footer);
  }

  paintInitialFrame(img1) {
    engine.init('scrolly-canvas', 'canvas-wrapper');
    engine.draw(1, true); // draw frame 1 instantly
    
    const placeholder = document.getElementById('fallback-img');
    if (placeholder) {
      placeholder.classList.add('hidden');
    }
  }

  onPreloadProgress(pct) {
    console.log(`Chassis Assets loading: ${Math.round(pct * 100)}%`);
  }

  onAssetsLoaded() {
    console.log('Chassis Systems Ready.');
    
    // Core systems
    scrollTimeline.init('scrolly-section', 'viewport');
    calloutSystem.init('callouts-container', 'svg-overlay', 'scrolly-canvas');
    mouseInteraction.init('canvas-wrapper');

    // Register Act II dynamic scroll trigger animations
    scrollTimeline.initEditorialAnimations();

    this.initialized = true;
    this.tick();
  }

  // Orchestrator Render and lerp tick
  tick() {
    if (!this.initialized) return;

    requestAnimationFrame(() => this.tick());

    this.targetProgress = scrollTimeline.getProgress();

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerpSpeed = prefersReduced ? MOTION.lerpFactorReduced : MOTION.lerpFactor;

    this.currentProgress += (this.targetProgress - this.currentProgress) * lerpSpeed;

    if (Math.abs(this.targetProgress - this.currentProgress) < 0.0001) {
      this.currentProgress = this.targetProgress;
    }

    const frameIndex = TIMELINE.getFrameForProgress(this.currentProgress);

    // Canvas draw and overlay shift coordinating
    engine.draw(frameIndex);
    calloutSystem.update(frameIndex);

    // Dynamic scene text fades and number count-ups
    this.updateScenes(this.currentProgress);

    // Developer debug Overlay ticker update
    this.updateDebugOverlay(this.currentProgress, frameIndex);
  }

  updateScenes(progress) {
    let activeScene = null;

    for (const sc of TIMELINE.scenes) {
      if (progress >= sc.scrollStart && progress <= sc.scrollEnd) {
        activeScene = sc;
        break;
      }
    }

    if (activeScene && activeScene.textElementId !== this.activeSceneId) {
      if (this.activeSceneId) {
        const prevEl = document.getElementById(this.activeSceneId);
        if (prevEl) prevEl.classList.remove('active');
      }

      this.activeSceneId = activeScene.textElementId;
      const nextEl = document.getElementById(this.activeSceneId);
      if (nextEl) nextEl.classList.add('active');

      this.triggerCounters(activeScene.id);
    }
  }

  triggerCounters(sceneId) {
    if (sceneId === 'scene-6' && !this.statsTriggered.scene6) {
      this.statsTriggered.scene6 = true;
      const nums = document.querySelectorAll('#story-scene-6 .spec-card-num');
      nums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        this.animateCountUp(el, target);
      });
    }

    if (sceneId === 'scene-9' && !this.statsTriggered.scene9) {
      this.statsTriggered.scene9 = true;
      const stats = document.querySelectorAll('#story-scene-9 .stat-box-value:not(.decimal)');
      stats.forEach(el => {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        this.animateCountUp(el, target);
      });
    }

    if (sceneId === 'scene-1' || sceneId === 'scene-15') {
      this.statsTriggered.scene6 = false;
      this.statsTriggered.scene9 = false;
    }
  }

  animateCountUp(el, target, duration = 1200) {
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);

      if (target === 13000) {
        el.textContent = currentVal.toLocaleString();
      } else {
        el.textContent = currentVal;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  // Developers debug pane initializers
  initDebugOverlay() {
    // Only bind if running locally (e.g. localhost, 127.0.0.1) to avoid production bleed
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';
                    
    if (!isLocal) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === 'true') {
      this.enableDebug();
    }

    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'd') {
        this.toggleDebug();
      }
    });
  }

  toggleDebug() {
    if (this.debugMode) {
      this.disableDebug();
    } else {
      this.enableDebug();
    }
  }

  enableDebug() {
    this.debugMode = true;
    if (!this.debugEl) {
      this.debugEl = document.createElement('div');
      this.debugEl.className = 'debug-overlay-panel';
      document.body.appendChild(this.debugEl);
    }
    this.debugEl.style.display = 'flex';
  }

  disableDebug() {
    this.debugMode = false;
    if (this.debugEl) {
      this.debugEl.style.display = 'none';
    }
  }

  updateDebugOverlay(progress, frameIndex) {
    if (!this.debugMode || !this.debugEl) return;

    this.frameCount++;
    const now = performance.now();
    if (now > this.lastFpsTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    let activeSceneId = 'N/A';
    for (const sc of TIMELINE.scenes) {
      if (progress >= sc.scrollStart && progress <= sc.scrollEnd) {
        activeSceneId = sc.id;
        break;
      }
    }

    this.debugEl.innerHTML = `
      <div><b>DUCATI COMPOSITION ENGINE DEBUG</b></div>
      <div>FPS: ${this.fps}</div>
      <div>Scroll Progress: ${(progress * 100).toFixed(2)}%</div>
      <div>Frame Index: ${frameIndex.toFixed(2)} / 51</div>
      <div>Active Chapter: ${activeSceneId}</div>
      <div>Layout Profile: ${engine.activeProfileName}</div>
      <div>Render Scale: ${engine.currentScale ? engine.currentScale.toFixed(4) : 'N/A'}</div>
      <div>Offset X: ${engine.currentOffsetX ? engine.currentOffsetX.toFixed(2) : 'N/A'}px</div>
      <div>Loaded Frames: ${preloader.loadedCount} / 51</div>
      <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
    `;
  }
}

// Start core orchestrations
const app = new Application();
document.addEventListener('DOMContentLoaded', () => app.init());
