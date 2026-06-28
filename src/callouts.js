// Callouts and SVG Connector Lines Subsystem
import { CALLOUTS } from './config/callouts.js';

class CalloutSystem {
  constructor() {
    this.container = null;
    this.svgOverlay = null;
    this.canvas = null;
    this.activeCalloutId = null;
    this.calloutElements = {};
  }

  init(containerId, svgId, canvasId) {
    this.container = document.getElementById(containerId);
    this.svgOverlay = document.getElementById(svgId);
    this.canvas = document.getElementById(canvasId);

    // Cache elements and set absolute coordinates
    CALLOUTS.forEach(cfg => {
      const card = document.getElementById(cfg.id);
      if (!card) return;

      const dot = card.querySelector('.callout-dot');
      if (dot) {
        dot.style.left = `${cfg.hotspot.x}%`;
        dot.style.top = `${cfg.hotspot.y}%`;
      }

      const panel = card.querySelector('.glass-panel');
      if (panel) {
        panel.style.position = 'absolute';
        panel.style.left = `calc(${cfg.hotspot.x}% + ${cfg.cardOffset.x}px)`;
        panel.style.top = `calc(${cfg.hotspot.y}% + ${cfg.cardOffset.y}px)`;
      }

      // Create matching SVG path element
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `path-${cfg.id}`);
      this.svgOverlay.appendChild(path);

      this.calloutElements[cfg.id] = { card, dot, panel, path, config: cfg };
    });

    this.updateLines();
    window.addEventListener('resize', () => this.updateLines());
  }

  // Draw connector lines between hotspots and panels dynamically
  updateLines() {
    if (!this.container || !this.svgOverlay) return;

    const overlayRect = this.svgOverlay.getBoundingClientRect();
    if (overlayRect.width === 0 || overlayRect.height === 0) return;

    CALLOUTS.forEach(cfg => {
      const els = this.calloutElements[cfg.id];
      if (!els || !els.dot || !els.panel || !els.path) return;

      const dotRect = els.dot.getBoundingClientRect();
      const panelRect = els.panel.getBoundingClientRect();

      // Get center coordinates of the dot relative to the SVG overlay container
      const dx = dotRect.left - overlayRect.left + dotRect.width / 2;
      const dy = dotRect.top - overlayRect.top + dotRect.height / 2;

      // Card coordinates relative to the SVG container space
      const px = panelRect.left - overlayRect.left;
      const py = panelRect.top - overlayRect.top;
      const pw = panelRect.width;
      const ph = panelRect.height;

      // Find nearest coordinate boundary on the card panel
      let targetX, targetY;

      if (dx < px) {
        targetX = px;
        targetY = py + ph / 2;
      } else if (dx > px + pw) {
        targetX = px + pw;
        targetY = py + ph / 2;
      } else {
        targetX = px + pw / 2;
        targetY = (dy < py) ? py : (py + ph);
      }

      // Convert layout absolute coordinates into SVG viewbox coordinates (1280x720)
      const scaleX = 1280 / overlayRect.width;
      const scaleY = 720 / overlayRect.height;

      const svgDx = dx * scaleX;
      const svgDy = dy * scaleY;
      const svgTx = targetX * scaleX;
      const svgTy = targetY * scaleY;

      // Draw angled elbow path (Apple-style visual connector)
      let dPath;
      const midX = svgDx + (svgTx - svgDx) * 0.3; // bend at 30% width
      
      if (Math.abs(svgDx - svgTx) > 40) {
        dPath = `M ${svgDx} ${svgDy} L ${midX} ${svgDy} L ${svgTx} ${svgTy}`;
      } else {
        dPath = `M ${svgDx} ${svgDy} L ${svgTx} ${svgTy}`;
      }

      els.path.setAttribute('d', dPath);
    });
  }

  // Monitor frame index to fade in/out relevant callouts
  update(frameIndex) {
    let nextActiveId = null;

    for (const cfg of CALLOUTS) {
      if (frameIndex >= cfg.startFrame && frameIndex < cfg.endFrame) {
        nextActiveId = cfg.id;
        break;
      }
    }

    if (nextActiveId !== this.activeCalloutId) {
      if (this.activeCalloutId) {
        const els = this.calloutElements[this.activeCalloutId];
        if (els) {
          els.card.classList.remove('active');
          els.path.classList.remove('active');
        }
      }

      this.activeCalloutId = nextActiveId;
      if (this.activeCalloutId) {
        const els = this.calloutElements[this.activeCalloutId];
        if (els) {
          this.updateLines();
          els.card.classList.add('active');
          els.path.classList.add('active');
        }
      }
    }
  }

  cleanup() {
    window.removeEventListener('resize', () => this.updateLines());
  }
}

export const calloutSystem = new CalloutSystem();
