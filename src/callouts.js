// Callouts and SVG Connector Lines Subsystem
import { CONFIG } from './config.js';

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

    // Cache elements and set absolute percentage coordinates for hotspots
    CONFIG.callouts.forEach(cfg => {
      const card = document.getElementById(cfg.id);
      if (!card) return;

      // Position the hotspot dot using CSS percentage offsets
      const dot = card.querySelector('.callout-dot');
      if (dot) {
        dot.style.left = `${cfg.hotspot.x}%`;
        dot.style.top = `${cfg.hotspot.y}%`;
      }

      // Position the glass panel relative to the hotspot
      const panel = card.querySelector('.glass-panel');
      if (panel) {
        panel.style.position = 'absolute';
        // Place using offsets
        panel.style.left = `calc(${cfg.hotspot.x}% + ${cfg.cardOffset.x}px)`;
        panel.style.top = `calc(${cfg.hotspot.y}% + ${cfg.cardOffset.y}px)`;
      }

      // Create matching SVG path element
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `path-${cfg.id}`);
      this.svgOverlay.appendChild(path);

      this.calloutElements[cfg.id] = { card, dot, panel, path, config: cfg };
    });

    // Update lines initially and register for resize events
    this.updateLines();
    window.addEventListener('resize', () => this.updateLines());
  }

  // Draw connector lines between hotspots and panels dynamically
  updateLines() {
    if (!this.container || !this.svgOverlay) return;

    const overlayRect = this.svgOverlay.getBoundingClientRect();
    if (overlayRect.width === 0 || overlayRect.height === 0) return;

    CONFIG.callouts.forEach(cfg => {
      const els = this.calloutElements[cfg.id];
      if (!els || !els.dot || !els.panel || !els.path) return;

      const dotRect = els.dot.getBoundingClientRect();
      const panelRect = els.panel.getBoundingClientRect();

      // Get center coords of the dot relative to the SVG container space
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
        // Dot is to the left of the card
        targetX = px;
        targetY = py + ph / 2;
      } else if (dx > px + pw) {
        // Dot is to the right of the card
        targetX = px + pw;
        targetY = py + ph / 2;
      } else {
        // Dot is vertically aligned, choose top or bottom edge
        targetX = px + pw / 2;
        targetY = (dy < py) ? py : (py + ph);
      }

      // Convert layout absolute coordinates into SVG viewbox coordinates (0..1280, 0..720)
      const scaleX = 1280 / overlayRect.width;
      const scaleY = 720 / overlayRect.height;

      const svgDx = dx * scaleX;
      const svgDy = dy * scaleY;
      const svgTx = targetX * scaleX;
      const svgTy = targetY * scaleY;

      // Draw path (Direct segment or subtle Apple-style angled elbow line)
      // An elbow path looks much cleaner and premium:
      // We go from dot, bend horizontally/vertically, then hit the card edge.
      let dPath;
      const midX = svgDx + (svgTx - svgDx) * 0.3; // bend after 30% of distance
      
      if (Math.abs(svgDx - svgTx) > 40) {
        // Angled elbow path
        dPath = `M ${svgDx} ${svgDy} L ${midX} ${svgDy} L ${svgTx} ${svgTy}`;
      } else {
        // Direct linear path if aligned closely
        dPath = `M ${svgDx} ${svgDy} L ${svgTx} ${svgTy}`;
      }

      els.path.setAttribute('d', dPath);
    });
  }

  // Monitor frame index to fade in/out relevant callouts
  update(frameIndex) {
    let nextActiveId = null;

    // Determine which callout is active based on frame index
    // Keep only one callout active at any given frame for clean focus
    for (const cfg of CONFIG.callouts) {
      if (frameIndex >= cfg.frameStart && frameIndex < cfg.frameEnd) {
        nextActiveId = cfg.id;
        break;
      }
    }

    if (nextActiveId !== this.activeCalloutId) {
      // Deactivate old callout
      if (this.activeCalloutId) {
        const els = this.calloutElements[this.activeCalloutId];
        if (els) {
          els.card.classList.remove('active');
          els.path.classList.remove('active');
        }
      }

      // Activate new callout
      this.activeCalloutId = nextActiveId;
      if (this.activeCalloutId) {
        const els = this.calloutElements[this.activeCalloutId];
        if (els) {
          // Re-calculate lines to ensure pixel accuracy on show
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
