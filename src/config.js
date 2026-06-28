// Configuration settings and Copywriting for the 15-Scene Ducati Cinematic Experience

export const CONFIG = {
  // Asset settings
  frames: {
    total: 51,
    basePath: 'frames/ezgif-frame-',
    extension: '.png',
    width: 1280, // Original frame resolution
    height: 720
  },

  // Scroll and Lerp parameters
  animation: {
    lerpFactor: 0.06, // High inertia for cinematic feel
    scrollMultiplier: 20, // 2000vh scroll height for immersive pacing
    mouseDriftX: 2.0, // Subdued drift (planted chassis)
    mouseDriftY: 1.2
  },

  // Map progress (0.0 to 1.0) to frame indices (1.0 to 51.0)
  getFrameForProgress(progress) {
    if (progress <= 0.13) return 1; // Scenes 1 & 2: Hero & Philosophy (fully assembled)
    
    if (progress <= 0.20) {
      // Scene 3: The Beginning (Start disassembly)
      const p = (progress - 0.13) / (0.20 - 0.13);
      return 1 + p * (12 - 1);
    }
    if (progress <= 0.26) return 12; // Scene 4: Carbon Fiber (Pause)
    
    if (progress <= 0.32) {
      // Scene 5: Titanium (Scrub to exhaust separation)
      const p = (progress - 0.26) / (0.32 - 0.26);
      return 12 + p * (13 - 12);
    }
    if (progress <= 0.40) {
      // Scene 6: Engine (Scrub to engine exposed)
      const p = (progress - 0.32) / (0.40 - 0.32);
      return 13 + p * (17 - 13);
    }
    if (progress <= 0.46) {
      // Scene 7: Suspension (Scrub to forks slide)
      const p = (progress - 0.40) / (0.46 - 0.40);
      return 17 + p * (20 - 17);
    }
    if (progress <= 0.52) {
      // Scene 8: Brembo Brakes (Scrub to peak exploded)
      const p = (progress - 0.46) / (0.52 - 0.46);
      return 20 + p * (25.5 - 20);
    }
    if (progress <= 0.76) return 25.5; // Scenes 9, 10, 11: Stats, History, Tech (Hold exploded)
    
    if (progress <= 0.82) {
      // Scene 12: Racing DNA (Start reassembly)
      const p = (progress - 0.76) / (0.82 - 0.76);
      return 25.5 + p * (28 - 25.5);
    }
    if (progress <= 0.88) {
      // Scene 13: Materials Science (Reassembly finishes)
      const p = (progress - 0.82) / (0.88 - 0.82);
      return 28 + p * (31 - 28);
    }
    // Scenes 14 & 15: Final holds (assembled)
    const p = (progress - 0.88) / (1.00 - 0.88);
    return 31 + p * (51 - 31);
  },

  // 15 Narrative Scenes definitions
  scenes: [
    {
      id: 'scene-1',
      scrollStart: 0.00,
      scrollEnd: 0.06,
      textElementId: 'story-scene-1',
      spotlight: null
    },
    {
      id: 'scene-2',
      scrollStart: 0.06,
      scrollEnd: 0.13,
      textElementId: 'story-scene-2',
      spotlight: null
    },
    {
      id: 'scene-3',
      scrollStart: 0.13,
      scrollEnd: 0.20,
      textElementId: 'story-scene-3',
      spotlight: null
    },
    {
      id: 'scene-4',
      scrollStart: 0.20,
      scrollEnd: 0.26,
      textElementId: 'story-scene-4',
      spotlight: { x: 45, y: 40 } // Fairing coordinates
    },
    {
      id: 'scene-5',
      scrollStart: 0.26,
      scrollEnd: 0.32,
      textElementId: 'story-scene-5',
      spotlight: { x: 68, y: 62 } // Exhaust coordinates
    },
    {
      id: 'scene-6',
      scrollStart: 0.32,
      scrollEnd: 0.40,
      textElementId: 'story-scene-6',
      spotlight: { x: 52, y: 54 } // Engine coordinates
    },
    {
      id: 'scene-7',
      scrollStart: 0.40,
      scrollEnd: 0.46,
      textElementId: 'story-scene-7',
      spotlight: { x: 26, y: 48 } // Suspension coordinates
    },
    {
      id: 'scene-8',
      scrollStart: 0.46,
      scrollEnd: 0.52,
      textElementId: 'story-scene-8',
      spotlight: { x: 18, y: 65 } // Brakes coordinates
    },
    {
      id: 'scene-9',
      scrollStart: 0.52,
      scrollEnd: 0.60,
      textElementId: 'story-scene-9',
      spotlight: null
    },
    {
      id: 'scene-10',
      scrollStart: 0.60,
      scrollEnd: 0.68,
      textElementId: 'story-scene-10',
      spotlight: null
    },
    {
      id: 'scene-11',
      scrollStart: 0.68,
      scrollEnd: 0.76,
      textElementId: 'story-scene-11',
      spotlight: null
    },
    {
      id: 'scene-12',
      scrollStart: 0.76,
      scrollEnd: 0.82,
      textElementId: 'story-scene-12',
      spotlight: null
    },
    {
      id: 'scene-13',
      scrollStart: 0.82,
      scrollEnd: 0.88,
      textElementId: 'story-scene-13',
      spotlight: null
    },
    {
      id: 'scene-14',
      scrollStart: 0.88,
      scrollEnd: 0.94,
      textElementId: 'story-scene-14',
      spotlight: null
    },
    {
      id: 'scene-15',
      scrollStart: 0.94,
      scrollEnd: 1.00,
      textElementId: 'story-scene-15',
      spotlight: null
    }
  ],

  // Coordinates mapping for standard floating hotspots (active during separation chapters)
  callouts: [
    {
      id: 'callout-fairing',
      hotspot: { x: 45, y: 40 },
      cardOffset: { x: -140, y: -160 },
      frameStart: 8,
      frameEnd: 16
    },
    {
      id: 'callout-exhaust',
      hotspot: { x: 68, y: 62 },
      cardOffset: { x: 80, y: -120 },
      frameStart: 13,
      frameEnd: 22
    },
    {
      id: 'callout-engine',
      hotspot: { x: 52, y: 54 },
      cardOffset: { x: 100, y: -150 },
      frameStart: 18,
      frameEnd: 26
    },
    {
      id: 'callout-suspension',
      hotspot: { x: 26, y: 48 },
      cardOffset: { x: -120, y: -180 },
      frameStart: 14,
      frameEnd: 24
    },
    {
      id: 'callout-brakes',
      hotspot: { x: 18, y: 65 },
      cardOffset: { x: -180, y: -130 },
      frameStart: 16,
      frameEnd: 25
    }
  ]
};
