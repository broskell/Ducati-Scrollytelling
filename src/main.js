// Main Orchestrator, Design System Injector, and Dynamic Renderer
import { TIMELINE } from './config/timeline.js';
import { LAYOUT } from './config/layout.js';
import { MOTION } from './config/motion.js';
import { COLORS } from './config/colors.js';
import { TYPOGRAPHY } from './config/typography.js';
import { preloader } from './preloader.js';
import { engine } from './engine.js';
import { scrollTimeline } from './timeline.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mouseInteraction } from './mouse.js';

gsap.registerPlugin(ScrollTrigger);
import {
  editorialSections,
  evolutionData,
  mechanicalData,
  technicalData,
  legendsData
} from './content/editorial.js';

class Application {
  constructor() {
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.activeSceneId = null;
    this.initialized = false;
    this.activeTab = 'home';
    
    // Developer debug properties
    this.debugMode = false;
    this.debugEl = null;
    this.lastFpsTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
  }

  init() {
    // 1. Inject design system tokens into CSS :root
    this.injectDesignTokens();

    // 2. Render Act II editorial articles dynamically
    this.renderActII();

    // 3. Render secondary section grid tabs
    this.renderEvolution();
    this.renderMechanical();
    this.renderTechnical();
    this.renderLegends();

    // 4. Setup tab click navigation handlers
    this.initTabSwitcher();

    // 5. Setup dev-only runtime debug triggers
    this.initDebugOverlay();

    // 6. Preload frame assets and begin Act I canvas engine
    preloader.init(
      (img1) => this.paintInitialFrame(img1),
      (pct) => this.onPreloadProgress(pct),
      (images) => this.onAssetsLoaded()
    );

    // 7. Setup glass header scroll listener and dynamic telemetry loop
    this.initHeaderScrollListener();
    this.initTelemetryLoop();
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

    root.innerHTML = '';

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
          <div class="editorial-container electronics-split-layout fade-up">
            <div class="electronics-info-side">
              <span class="scene-accent">03 / INERTIAL COGNITIVE SYSTEMS</span>
              <h2 class="editorial-title">${section.title}</h2>
              <h3 class="premium-sub">${section.subtitle}</h3>
              <p class="scene-narrative">${section.body}</p>
              
              <!-- Live Telemetry HUD Dials -->
              <div class="telemetry-hud-container">
                <div class="telemetry-hud-card glass-panel" data-telemetry="yaw">
                  <svg class="hud-circle" viewBox="0 0 100 100">
                    <circle class="hud-circle-bg" cx="50" cy="50" r="40"></circle>
                    <circle class="hud-circle-fill" cx="50" cy="50" r="40" style="stroke-dasharray: 251.2; stroke-dashoffset: 210;"></circle>
                  </svg>
                  <div class="hud-data">
                    <span class="hud-label">YAW</span>
                    <span class="hud-value" id="hud-yaw-val">0.0°</span>
                  </div>
                </div>
                <div class="telemetry-hud-card glass-panel" data-telemetry="roll">
                  <svg class="hud-circle" viewBox="0 0 100 100">
                    <circle class="hud-circle-bg" cx="50" cy="50" r="40"></circle>
                    <circle class="hud-circle-fill" cx="50" cy="50" r="40" style="stroke-dasharray: 251.2; stroke-dashoffset: 120;"></circle>
                  </svg>
                  <div class="hud-data">
                    <span class="hud-label">ROLL</span>
                    <span class="hud-value" id="hud-roll-val">0.0°</span>
                  </div>
                </div>
                <div class="telemetry-hud-card glass-panel" data-telemetry="pitch">
                  <svg class="hud-circle" viewBox="0 0 100 100">
                    <circle class="hud-circle-bg" cx="50" cy="50" r="40"></circle>
                    <circle class="hud-circle-fill" cx="50" cy="50" r="40" style="stroke-dasharray: 251.2; stroke-dashoffset: 240;"></circle>
                  </svg>
                  <div class="hud-data">
                    <span class="hud-label">PITCH</span>
                    <span class="hud-value" id="hud-pitch-val">0.0°</span>
                  </div>
                </div>
                <div class="telemetry-hud-card glass-panel" data-telemetry="brake">
                  <svg class="hud-circle" viewBox="0 0 100 100">
                    <circle class="hud-circle-bg" cx="50" cy="50" r="40"></circle>
                    <circle class="hud-circle-fill" cx="50" cy="50" r="40" style="stroke-dasharray: 251.2; stroke-dashoffset: 180;"></circle>
                  </svg>
                  <div class="hud-data">
                    <span class="hud-label">BRAKE</span>
                    <span class="hud-value" id="hud-brake-val">0 bar</span>
                  </div>
                </div>
              </div>
              
              <!-- Cognitive Assist Cards Grid -->
              <div class="cognitive-chips-grid">
                ${section.cards.map((card, i) => `
                  <div class="cognitive-chip glass-panel fade-in-chip" style="transition-delay: ${i * 0.1}s;">
                    <span class="chip-icon">${card.icon}</span>
                    <div class="chip-content">
                      <h4 class="chip-title">${card.title}</h4>
                      <p class="chip-desc">${card.text}</p>
                    </div>
                  </div>
                `).join('')}
                <div class="cognitive-chip glass-panel fade-in-chip" style="transition-delay: 0.4s;">
                  <span class="chip-icon">EBC</span>
                  <div class="chip-content">
                    <h4 class="chip-title">Engine Brake Control</h4>
                    <p class="chip-desc">Optimizes rear wheel stability under extreme decel torque.</p>
                  </div>
                </div>
                <div class="cognitive-chip glass-panel fade-in-chip" style="transition-delay: 0.5s;">
                  <span class="chip-icon">DSC</span>
                  <div class="chip-content">
                    <h4 class="chip-title">Ducati Slide Control</h4>
                    <p class="chip-desc">Governs drift angles smoothly during slide-out sweeps.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Side Visual Showcase -->
            <div class="electronics-visual-side">
              <div class="telemetry-particles-bg"></div>
              <div class="gyro-visual-container">
                <div class="gyro-ring ring-outer"></div>
                <div class="gyro-ring ring-middle"></div>
                <div class="gyro-ring ring-inner"></div>
                <img class="cognitive-assist-hero-img" src="assets/cognitive-assist.webp" alt="Cognitive Assist Telemetry Visualization">
              </div>
              <div class="hud-telemetry-panel glass-panel">
                <div class="hud-telemetry-header">BOSCH 6-AXIS IMU ACTIVE</div>
                <div class="hud-telemetry-body">
                  <div class="hud-telemetry-item">LEAN ANGLE: <span class="text-glow" id="imu-lean-val">0.0°</span></div>
                  <div class="hud-telemetry-item">LATERAL G-FORCE: <span class="text-glow" id="imu-g-val">0.0 G</span></div>
                  <div class="hud-telemetry-item">TRACTION SLIP: <span class="text-glow" id="imu-slip-val">0%</span></div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (section.type === 'heritage-timeline') {
        contentHTML = `
          <div class="timeline-museum-layout">
            <!-- Left Side: Sticky Chapter Title -->
            <div class="timeline-sticky-left">
              <div class="sticky-inner">
                <span class="scene-accent">04 / CORSE HERITAGE</span>
                <h2 class="timeline-huge-title font-serif">Racing<br>DNA<br>Chronology</h2>
                <p class="timeline-quote font-serif">“Every championship reshaped the machine.”</p>
                <p class="timeline-desc">Ducati's competitive history is a seventy-year chronicle of mechanical breakthroughs. Track limits are forced into production lines, proving desmodromic actuation on the world's most demanding circuits.</p>
              </div>
            </div>
            
            <!-- Center Column: Glowing Vertical Timeline Line -->
            <div class="timeline-center-line-wrapper">
              <div class="timeline-progress-line" id="timeline-progress-line"></div>
              <div class="timeline-nodes-container">
                ${section.timeline.map((node, i) => `
                  <div class="timeline-progress-node" id="timeline-node-${i}" data-index="${i}">
                    <div class="node-pulse"></div>
                    <span class="node-year-label">${node.year}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Right Column: Staggered Milestone Viewports -->
            <div class="timeline-milestones-column">
              ${section.timeline.map((node, i) => {
                let imgPath = 'assets/timeline-present.webp';
                if (node.year === '1926') imgPath = 'assets/timeline-1926.webp';
                else if (node.year === '1972') imgPath = 'assets/timeline-1972.webp';
                else if (node.year === '1994') imgPath = 'assets/timeline-1994.webp';
                else if (node.year === '2007') imgPath = 'assets/timeline-2007.webp';
                
                return `
                  <div class="milestone-chapter" id="milestone-chapter-${i}" data-index="${i}">
                    <div class="milestone-card glass-panel">
                      <span class="milestone-year-huge font-serif">${node.year}</span>
                      <h3 class="milestone-title font-serif">${node.event}</h3>
                      <p class="milestone-body">${node.body}</p>
                      
                      <div class="milestone-image-wrapper">
                        <img class="milestone-img" src="${imgPath}" alt="${node.event}" loading="lazy" decoding="async">
                        <div class="milestone-image-shroud"></div>
                      </div>
                      
                      <div class="milestone-spec-chips">
                        <span class="spec-chip">CHASSIS REFINE</span>
                        <span class="spec-chip">DESMO ACTUATED</span>
                        <span class="spec-chip">CORSE SPEED</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
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
      <h1 class="footer-title">Desmosedici</h1>
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
    const percent = Math.round(pct * 100);
    const progressBar = document.getElementById('loader-progress-bar');
    const progressText = document.getElementById('loader-percentage-text');
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}%`;
  }

  onAssetsLoaded() {
    console.log('Chassis Systems Ready.');
    
    // 1. Enable page scrolling first by removing the loading lock class
    document.body.classList.remove('loading');

    // 2. Add visible class to home pane to trigger fade-in transition
    const homePane = document.getElementById('tab-section-home');
    if (homePane) {
      homePane.classList.add('visible');
    }

    // 3. Core systems
    scrollTimeline.init('scrolly-section', 'viewport');
    mouseInteraction.init('canvas-wrapper');

    // Register Act II dynamic scroll trigger animations
    scrollTimeline.initEditorialAnimations();

    this.initEditorialInteractiveTimelines();

    this.initialized = true;

    // Force canvas resize and draw initial frame 1 to prevent layout-settling blank states
    engine.resize();
    engine.draw(1, true);

    // 4. Smoothly fade out the preloader overlay
    const preloaderOverlay = document.getElementById('preloader');
    if (preloaderOverlay) {
      preloaderOverlay.classList.add('fade-out');
      // Remove from DOM after transition completes to save layers
      setTimeout(() => {
        preloaderOverlay.style.display = 'none';
        
        // Recalculate ScrollTrigger positions now that DOM layout has settled and preloader is hidden
        ScrollTrigger.refresh();
      }, 800);
    }

    // Start rendering frame loop
    this.tick();
  }

  // Orchestrator Render and lerp tick
  tick() {
    if (!this.initialized) return;

    requestAnimationFrame(() => this.tick());

    // Pause heavy rendering checks when not on Home tab to save battery and GPU cycles
    if (this.activeTab !== 'home') return;

    this.targetProgress = scrollTimeline.getProgress();

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerpSpeed = prefersReduced ? MOTION.lerpFactorReduced : MOTION.lerpFactor;

    this.currentProgress += (this.targetProgress - this.currentProgress) * lerpSpeed;

    if (Math.abs(this.targetProgress - this.currentProgress) < 0.0001) {
      this.currentProgress = this.targetProgress;
    }

    const frameIndex = TIMELINE.getFrameForProgress(this.currentProgress);

    // Canvas draw coordinating
    engine.draw(frameIndex);

    // Dynamic scene text fades
    this.updateScenes(this.currentProgress);

    // Developer debug Overlay ticker update
    this.updateDebugOverlay(this.currentProgress, frameIndex);
  }

  // Render secondary grids dynamically from databases
  renderEvolution() {
    const titleEl = document.getElementById('evolution-title');
    const subtitleEl = document.getElementById('evolution-subtitle');
    const container = document.getElementById('evolution-grid-container');
    if (!container) return;

    titleEl.textContent = evolutionData.title;
    subtitleEl.textContent = evolutionData.subtitle;
    container.innerHTML = '';

    evolutionData.cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'editorial-card';
      cardEl.innerHTML = `
        <span class="card-num-badge">${card.era}</span>
        <div class="card-image-wrapper">
          <img class="card-image" src="${card.image}" loading="lazy" decoding="async" alt="${card.title}">
        </div>
        <h3 class="card-title">${card.title}</h3>
        <p class="card-body">${card.body}</p>
        <div class="card-footer">
          <span class="card-meta">SIGNATURE IDEA</span>
          <div style="color: var(--color-text-primary); margin-top: 4px; font-weight: 500; font-size: 12px; letter-spacing: 0.5px;">${card.idea}</div>
        </div>
      `;
      container.appendChild(cardEl);
    });
  }

  renderMechanical() {
    const titleEl = document.getElementById('mechanical-title');
    const subtitleEl = document.getElementById('mechanical-subtitle');
    const container = document.getElementById('mechanical-grid-container');
    if (!container) return;

    titleEl.textContent = mechanicalData.title;
    subtitleEl.textContent = mechanicalData.subtitle;
    container.innerHTML = '';

    mechanicalData.cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'editorial-card';
      cardEl.innerHTML = `
        <span class="card-num-badge">${card.num}</span>
        <div class="card-image-wrapper">
          <img class="card-image" src="${card.image}" loading="lazy" decoding="async" alt="${card.title}">
        </div>
        <h3 class="card-title">${card.title}</h3>
        <p class="card-body">${card.body}</p>
      `;
      container.appendChild(cardEl);
    });
  }

  renderTechnical() {
    const titleEl = document.getElementById('technical-title');
    const subtitleEl = document.getElementById('technical-subtitle');
    const container = document.getElementById('technical-grid-container');
    if (!container) return;

    titleEl.textContent = technicalData.title;
    subtitleEl.textContent = technicalData.subtitle;
    container.innerHTML = '';

    technicalData.cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'editorial-card';
      cardEl.innerHTML = `
        <div class="card-icon-badge">${card.icon}</div>
        <h3 class="card-title" style="margin-top: 8px;">${card.title}</h3>
        <p class="card-body">${card.desc}</p>
      `;
      container.appendChild(cardEl);
    });
  }

  renderLegends() {
    const titleEl = document.getElementById('legends-title');
    const subtitleEl = document.getElementById('legends-subtitle');
    const container = document.getElementById('legends-grid-container');
    if (!container) return;

    titleEl.textContent = legendsData.title;
    subtitleEl.textContent = legendsData.subtitle;
    container.innerHTML = '';

    legendsData.cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'editorial-card';
      cardEl.innerHTML = `
        <div class="card-image-wrapper" style="aspect-ratio: 1/1;">
          <img class="card-image" src="${card.image}" loading="lazy" decoding="async" alt="${card.name}">
        </div>
        <span class="card-meta" style="margin-top: 8px;">${card.role}</span>
        <h3 class="card-title" style="font-size: 1.8rem; margin-top: 4px;">${card.name}</h3>
        <p class="card-body">${card.body}</p>
        <div class="card-footer" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
          <span class="card-meta" style="color: var(--color-accent-red);">ACHIEVEMENTS</span>
          <div style="color: var(--color-text-primary); margin-top: 4px; font-weight: 500; font-size: 12px; letter-spacing: 0.5px;">${card.achievements}</div>
        </div>
      `;
      container.appendChild(cardEl);
    });
  }

  // Awwwards glass header scroll lock listener
  initHeaderScrollListener() {
    const header = document.querySelector('.microsite-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Dynamic F1 telemetry ticking dashboard loop
  initTelemetryLoop() {
    setInterval(() => {
      // Only update if the technical tab is selected
      if (this.activeTab !== 'technical') return;

      const leanEl = document.getElementById('hud-lean');
      const brakeEl = document.getElementById('hud-brake');
      const rollEl = document.getElementById('hud-roll');
      const slipEl = document.getElementById('hud-slip');
      const flowEl = document.getElementById('telemetry-flow');

      if (leanEl) {
        // Realistic roll angles in lean (fluctuate around 40-48 deg)
        const lean = (40.5 + Math.sin(Date.now() / 800) * 6.5).toFixed(1);
        leanEl.textContent = `LEAN ANGLE: ${lean}°`;
      }
      if (brakeEl) {
        // Realistic brake pressure cycling
        const cycle = Math.sin(Date.now() / 1500);
        const brake = (cycle > 0.3) ? (4.2 + Math.cos(Date.now() / 300) * 5.8).toFixed(1) : '0.0';
        brakeEl.textContent = `BRAKE PRES: ${brake} bar`;
      }
      if (rollEl) {
        const roll = (Math.sin(Date.now() / 600) * 1.2).toFixed(1);
        const pitch = (Math.cos(Date.now() / 900) * 0.6).toFixed(1);
        rollEl.textContent = `ROLL/PITCH: ${roll}° / ${pitch}°`;
      }
      if (slipEl) {
        const slip = (1.0 + Math.abs(Math.sin(Date.now() / 500)) * 0.12).toFixed(2);
        slipEl.textContent = `TC SLIP INDEX: ${slip}`;
      }
      if (flowEl) {
        const speed = (285.0 + Math.sin(Date.now() / 500) * 14.0).toFixed(1);
        flowEl.textContent = `FLOW-VELOCITY: ${speed} KM/H`;
      }
    }, 100);
  }

  // Initialize navigation link click listeners (Awwwards-inspired fades)
  initTabSwitcher() {
    const links = document.querySelectorAll('.nav-link');
    const actionBtn = document.getElementById('action-btn-index');

    const updateActionButton = (tabId) => {
      if (!actionBtn) return;
      switch (tabId) {
        case 'home':
          actionBtn.textContent = 'MECHANICAL INDEX';
          break;
        case 'evolution':
          actionBtn.textContent = 'EVOLUTION ARCHIVE';
          break;
        case 'mechanical':
          actionBtn.textContent = 'TECHNICAL SYSTEMS';
          break;
        case 'technical':
          actionBtn.textContent = 'INERTIAL DATA';
          break;
        case 'legends':
          actionBtn.textContent = 'LEGENDS ARCHIVE';
          break;
      }
    };

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');
        if (targetTab === this.activeTab) return;

        // 1. Highlight active navigation tab link
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // 2. Animate Action Button content
        updateActionButton(targetTab);

        // 3. Fade out the old active section pane
        const currentPane = document.getElementById(`tab-section-${this.activeTab}`);
        const nextPane = document.getElementById(`tab-section-${targetTab}`);

        if (currentPane && nextPane) {
          // Fade-out current pane
          currentPane.classList.remove('visible');
          
          setTimeout(() => {
            // Hide current, show next pane
            currentPane.classList.remove('active');
            nextPane.classList.add('active');

            // Scroll directly to top
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Set activeTab state to switch tick pausing
            this.activeTab = targetTab;

            // Trigger fresh layout sizes on canvas resize if going back to home
            if (targetTab === 'home') {
              engine.resize();
              // Trigger ScrollTrigger layout refreshes so pinning works smoothly
              if (window.ScrollTrigger) {
                window.ScrollTrigger.refresh();
              }
            }

            // Small tick delay to trigger CSS fade-in
            setTimeout(() => {
              nextPane.classList.add('visible');
            }, 50);

          }, 400); // matches fade out time
        }
      });
    });

    // Setup action button quick-switching clicks
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        let targetNavTab = 'home';
        if (this.activeTab === 'home') targetNavTab = 'mechanical';
        else if (this.activeTab === 'mechanical') targetNavTab = 'technical';
        else if (this.activeTab === 'technical') targetNavTab = 'legends';
        else if (this.activeTab === 'legends') targetNavTab = 'evolution';
        else targetNavTab = 'home';

        const linkEl = document.querySelector(`.nav-link[data-tab="${targetNavTab}"]`);
        if (linkEl) linkEl.click();
      });
    }
  }

  updateScenes(progress) {
    let activeScene = null;

    for (const sc of TIMELINE.scenes) {
      if (progress >= sc.scrollStart && progress <= sc.scrollEnd) {
        activeScene = sc;
        break;
      }
    }

    if (activeScene) {
      if (activeScene.textElementId !== this.activeSceneId) {
        if (this.activeSceneId) {
          const prevEl = document.getElementById(this.activeSceneId);
          if (prevEl) prevEl.classList.remove('active');
        }

        this.activeSceneId = activeScene.textElementId;
        const nextEl = document.getElementById(this.activeSceneId);
        if (nextEl) nextEl.classList.add('active');
      }
    } else {
      // Smoothly hide text overlay when scrolling through intermediate frames (State 2)
      if (this.activeSceneId) {
        const prevEl = document.getElementById(this.activeSceneId);
        if (prevEl) prevEl.classList.remove('active');
        this.activeSceneId = null;
      }
    }
  }

  // Developers debug pane initializers
  initDebugOverlay() {
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

  initEditorialInteractiveTimelines() {
    // Check if gsap is available
    if (typeof gsap === 'undefined') return;

    // 1. Cognitive Assist (electronics-grid) GSAP interactive dashboard triggers
    const telemetryObj = { yaw: 0, roll: 0, pitch: 0, brake: 0, lean: 0, gforce: 0, slip: 0 };
    const electronicsTL = gsap.timeline({
      scrollTrigger: {
        trigger: '.electronics-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    });

    electronicsTL.to(telemetryObj, {
      yaw: 12.5,
      roll: 58.4,
      pitch: 2.1,
      brake: 11.8,
      lean: 58.4,
      gforce: 1.45,
      slip: 4,
      onUpdate: () => {
        const yawEl = document.getElementById('hud-yaw-val');
        const rollEl = document.getElementById('hud-roll-val');
        const pitchEl = document.getElementById('hud-pitch-val');
        const brakeEl = document.getElementById('hud-brake-val');
        const leanEl = document.getElementById('imu-lean-val');
        const gforceEl = document.getElementById('imu-g-val');
        const slipEl = document.getElementById('imu-slip-val');

        if (yawEl) yawEl.textContent = `${telemetryObj.yaw.toFixed(1)}°`;
        if (rollEl) rollEl.textContent = `${telemetryObj.roll.toFixed(1)}°`;
        if (pitchEl) pitchEl.textContent = `${telemetryObj.pitch.toFixed(1)}°`;
        if (brakeEl) brakeEl.textContent = `${Math.round(telemetryObj.brake)} bar`;
        if (leanEl) leanEl.textContent = `${telemetryObj.lean.toFixed(1)}°`;
        if (gforceEl) gforceEl.textContent = `${telemetryObj.gforce.toFixed(2)} G`;
        if (slipEl) slipEl.textContent = `${Math.round(telemetryObj.slip)}%`;

        // Update SVG circle stroke dashoffsets dynamically to match percentages/dials
        const circles = document.querySelectorAll('.hud-circle-fill');
        circles.forEach((circle) => {
          const parentCard = circle.closest('.telemetry-hud-card');
          if (!parentCard) return;
          const type = parentCard.getAttribute('data-telemetry');
          let val = 0;
          let maxVal = 100;
          if (type === 'yaw') { val = telemetryObj.yaw; maxVal = 20; }
          else if (type === 'roll') { val = telemetryObj.roll; maxVal = 65; }
          else if (type === 'pitch') { val = telemetryObj.pitch; maxVal = 5; }
          else if (type === 'brake') { val = telemetryObj.brake; maxVal = 15; }

          const strokeDasharray = 251.2; // 2 * pi * 40
          const progress = Math.min(Math.max(val / maxVal, 0), 1);
          circle.style.strokeDashoffset = strokeDasharray - (progress * strokeDasharray);
        });
      }
    }, 0);

    // Parallax lean visual
    electronicsTL.to('.cognitive-assist-hero-img', {
      rotation: -12,
      scale: 1.06,
      yPercent: 8,
      ease: 'none'
    }, 0);

    // Rotate telemetry gyroscope rings
    electronicsTL.to('.ring-outer', { rotation: 120, ease: 'none' }, 0);
    electronicsTL.to('.ring-middle', { rotation: -180, ease: 'none' }, 0);
    electronicsTL.to('.ring-inner', { rotation: 95, ease: 'none' }, 0);

    // Staggered reveals for cards and chips
    electronicsTL.fromTo('.telemetry-hud-card', {
      opacity: 0,
      y: 30,
      scale: 0.96
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.08,
      duration: 0.6
    }, 0);

    electronicsTL.fromTo('.fade-in-chip', {
      opacity: 0,
      y: 20,
      scale: 0.97
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.06,
      duration: 0.6
    }, 0.2);

    // 2. Racing DNA Chronology vertical timeline animation
    gsap.fromTo('#timeline-progress-line', {
      height: '0%'
    }, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-museum-layout',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: true
      }
    });

    const milestones = document.querySelectorAll('.milestone-chapter');
    milestones.forEach((stone) => {
      const idx = stone.getAttribute('data-index');
      ScrollTrigger.create({
        trigger: stone,
        start: 'top 65%',
        end: 'bottom 65%',
        onEnter: () => {
          const node = document.getElementById(`timeline-node-${idx}`);
          if (node) node.classList.add('active');
          stone.classList.add('active');
        },
        onEnterBack: () => {
          const node = document.getElementById(`timeline-node-${idx}`);
          if (node) node.classList.add('active');
          stone.classList.add('active');
        },
        onLeave: () => {
          const node = document.getElementById(`timeline-node-${idx}`);
          if (node) node.classList.remove('active');
          stone.classList.remove('active');
        },
        onLeaveBack: () => {
          const node = document.getElementById(`timeline-node-${idx}`);
          if (node) node.classList.remove('active');
          stone.classList.remove('active');
        }
      });
    });
  }
}

// Start core orchestrations
const app = new Application();
document.addEventListener('DOMContentLoaded', () => app.init());
