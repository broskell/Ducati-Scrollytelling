# Ducati Desmosedici V4 — Premium Interactive Scrollytelling

An immersive, highly-optimized interactive product showcase for the legendary Ducati Panigale V4. Built with high-performance canvas scrubbing, responsive composition scaling, and a luxurious magazine-style editorial layout.

[![Framework: Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?style=flat-in-square&logo=vite)](https://vite.dev/)
[![Animation: GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02.svg?style=flat-in-square&logo=greensock)](https://gsap.com/)
[![Deployment: Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg?style=flat-in-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-in-square)](LICENSE)

---

## 📖 Project Overview

This project was built to explore the boundaries of web-based interactive product presentations, taking design cues from premium automotive configurations and digital editorial magazines. 

Instead of traditional, marketing-heavy scroll setups loaded with text overlays, the experience is divided into **two distinct acts** that balance cinema, performance, and information:

### Act I: The Assembly (Scroll-Driven Cinematic Canvas)
A pinned, high-performance canvas sequence where the visitor controls the mechanical disassembly and reassembly of the Panigale V4. In this act, the interface is stripped of heavy UI widgets to let the motorcycle’s silhouette, dynamic lighting, and motion be the dominant storytellers. It contains three states:
1. **Opening Hero**: Bold title entrance establishing the *Desmosedici* lineage.
2. **Interactive Scroll**: A clean, distraction-free visual disassembly where frames respond continuously to scrolling speed.
3. **Specs Reveal**: A premium, minimal stats board displaying core metrics (Displacement, Power, Torque, Weight, Top Speed) on the fully assembled bike.

---

### Act II: The Anatomy (Premium Magazine Editorial)
As the visitor scrolls past the assembly stage, the canvas unpins naturally to transition into a premium editorial grid. This act delivers detailed technical articles styled as a luxury physical magazine, showcasing close-up photography, composite specifications, and mechanical breakdowns.

![Act I: Assembled Profile and Developer Metric Panel](screenshots/act1_landing.png)

---

## ✨ Features

* **Scroll-Controlled Frame Scrubbing**: Crossfades and interpolates a high-resolution 51-frame render sequence.
* **Responsive Composition Engine**: Automatically determines optimal scales per device, applying safe margin checks to prevent component clipping.
* **Offset Framing System**: Positions the motorcycle off-center (`3.5%` shift right on desktop) to optimize visual weight and balance spacing.
* **Mouse Micro-Drift & Lighting**: Dampened parallax coordinates that shift the canvas wrapper dynamically in response to mouse coordinates, panning spotlight radial gradients to simulate studio lighting.
* **Integrated PWA Icons**: Complete icon suite derived from our calligraphic Desmosedici emblem, configured for high-res favicon setups and standalone app installs (`manifest.json`).
* **Telemetry HUD Dials (Cognitive Assist)**: Real-time SVG progress circles displaying Yaw, Roll, Pitch, and Brake Pressure counting up as the user scrolls down, accompanied by a lean-synchronized gyroscope image visual.
* **Museum Chronology Timeline (Racing DNA)**: Immersive vertical timeline progress bar that fills up on scroll, pulsing milestone node indicators, and stagger-revealing historical photos from blur.
* **Accessibility Easing**: Instantly responds to system `prefers-reduced-motion: reduce` by replacing scaling with flat fades and removing parallax drift.

---

## 🎨 Visual Assets Showcase

The project includes premium, custom-designed media assets generated to reflect Ducati's engineering prestige:

| Asset | Preview | Purpose |
|---|---|---|
| `assets/desmosedici-logo.png` | Cursive heritage branding | Browser Favicon / PWA Web App Icon |
| `assets/cognitive-assist.webp` | Leaning bike & telemetry HUD | Cognitive Assist main showcase visual |
| `assets/timeline-1926.webp` | Vintage Bologna radio factory | Chronology Milestone: Foundation |
| `assets/timeline-1972.webp` | Legendary 750 Desmo racer | Chronology Milestone: Imola Breakthrough |
| `assets/timeline-1994.webp` | Iconic red Ducati 916 | Chronology Milestone: Tamburini Masterpiece |
| `assets/timeline-2007.webp` | Casey Stoner's MotoGP GP7 | Chronology Milestone: World Domination |
| `assets/timeline-present.webp` | Track-derived Panigale V4 | Chronology Milestone: Present Lineage |

---

## 🎨 Design System & Typography

The typography and colors evoke the premium aesthetic of a physical racing catalog:
* **Typography**:
  - **Brand logo/wordmarks**: Styled in the delicate cursive **Monsieur La Doulaise** script font in mixed-case capitalization (`Desmosedici`) to prevent overlaps.
  - **Home Page Hero Titles**: Styled in **IM Fell English Italic** with oversized clamps (`clamp(5rem, 8vw, 8rem)`), letter-spacing (`-0.04em`), and max-width bounds (`60%`) for a premium editorial layout.
  - **Tabs & Section Headers**: Styled in the clean serif **Cormorant Garamond** for a traditional, sophisticated editorial catalog look.
  - **Interface & HUD Elements**: Styled in **Geist** sans-serif font for highly legible technical telemetry.
* **Color System**: Grounded in Pitch Black (`#000000`) and pure whites, utilizing the signature Ducati Red (`#D4001F`) as a sparse accent color for key specs, active HUD elements, and vertical timeline progress lines.
* **Glassmorphic Accents**: Editorial dashboards use frosted glass overlays (`backdrop-filter: blur(16px)`) with thin borders to divide content layers.

![Act II: Specifications Table & Chronological Timeline Milestones](screenshots/act2_timeline_specs.png)

---

## 🛠️ Architecture

The codebase separates the design system tokens, copy database, rendering engine, and scroll-triggers into modular ES Modules:

```
ducati-scrollytelling/
├── public/                # Static assets served at root
│   ├── assets/            # High-resolution generated visual assets
│   ├── frames/            # 51 cinematic motorcycle render frames
│   ├── favicon.ico        # Root application favicons
│   └── manifest.json      # PWA Configuration mapping
├── screenshots/           # Case study visual showcase
├── src/
│   ├── config/            # Design System Layer
│   │   ├── colors.js      # Theme hex, RGBA, and glass variables
│   │   ├── layout.js      # Occupancy margins, panning offsets, and breakpoints
│   │   ├── motion.js      # Lerps, mouse drift limits, and animation timings
│   │   ├── timeline.js    # Cinematic chapter starts and frame mapping
│   │   └── typography.js  # Typographic font clamps
│   ├── content/
│   │   └── editorial.js   # Copy database for Act II magazine layout
│   ├── engine.js          # Canvas composition and frame crossfade engine
│   ├── main.js            # Initializer, token injector, and dynamic renderer
│   ├── mouse.js           # Mouse floating and lighting sweep coordinates
│   └── timeline.js        # GSAP ScrollTrigger pinning and parallax triggers
├── index.html             # Progressive Level 1 markup & script entry
├── styles.css             # Fluid layout tokens & responsive grid styles
└── vite.config.js         # Build pipeline options
```

---

## 🔧 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/broskell/Ducati-Scrollytelling.git
   cd Ducati-Scrollytelling
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to preview the project locally.

4. **Compile Production Build**:
   ```bash
   npm run build
   ```
   The compiled static files will be located in the `dist/` directory, ready to serve.

---

## 🏆 Credits

* **Ducati Motor Holding S.p.A.**: Design, engineering, and architectural inspiration of the Panigale V4.
* **GreenSock (GSAP)**: High-performance scrolling animations and pinning utilities.
* **Vite**: Lightweight, blazing-fast bundler and dev environment.
* **Vercel**: Seamless cloud hosting and serverless deployments.
