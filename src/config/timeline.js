// Design System: Storytelling Timeline Chapters & Frame Mapping Configuration
export const TIMELINE = {
  totalFrames: 51,
  scrollLengthMultiplier: 20, // 2000vh total height
  frames: {
    basePath: 'frames/ezgif-frame-',
    extension: '.png',
    total: 51,
    width: 1280,
    height: 720
  },

  scenes: [
    {
      id: 'scene-1',
      textElementId: 'story-scene-1',
      scrollStart: 0.00,
      scrollEnd: 0.05,
      targetFrame: 1
    },
    {
      id: 'scene-2',
      textElementId: 'story-scene-2',
      scrollStart: 0.05,
      scrollEnd: 0.12,
      targetFrame: 1
    },
    {
      id: 'scene-3',
      textElementId: 'story-scene-3',
      scrollStart: 0.12,
      scrollEnd: 0.20,
      targetFrame: 5
    },
    {
      id: 'scene-4',
      textElementId: 'story-scene-4',
      scrollStart: 0.20,
      scrollEnd: 0.27,
      targetFrame: 11,
      spotlight: { x: 35, y: 35 } // Fairing zoom coordinates
    },
    {
      id: 'scene-5',
      textElementId: 'story-scene-5',
      scrollStart: 0.27,
      scrollEnd: 0.35,
      targetFrame: 15,
      spotlight: { x: 70, y: 65 } // Exhaust zoom coordinates
    },
    {
      id: 'scene-6',
      textElementId: 'story-scene-6',
      scrollStart: 0.35,
      scrollEnd: 0.43,
      targetFrame: 20,
      spotlight: { x: 50, y: 55 } // Engine zoom coordinates
    },
    {
      id: 'scene-7',
      textElementId: 'story-scene-7',
      scrollStart: 0.43,
      scrollEnd: 0.50,
      targetFrame: 25,
      spotlight: { x: 25, y: 40 } // Forks/Suspension zoom coordinates
    },
    {
      id: 'scene-8',
      textElementId: 'story-scene-8',
      scrollStart: 0.50,
      scrollEnd: 0.56,
      targetFrame: 29,
      spotlight: { x: 28, y: 68 } // Calipers/Brakes zoom coordinates
    },
    {
      id: 'scene-9',
      textElementId: 'story-scene-9',
      scrollStart: 0.56,
      scrollEnd: 0.60,
      targetFrame: 30
    },
    {
      id: 'scene-10',
      textElementId: 'story-scene-10',
      scrollStart: 0.60,
      scrollEnd: 0.68,
      targetFrame: 30
    },
    {
      id: 'scene-11',
      textElementId: 'story-scene-11',
      scrollStart: 0.68,
      scrollEnd: 0.75,
      targetFrame: 30
    },
    {
      id: 'scene-12',
      textElementId: 'story-scene-12',
      scrollStart: 0.75,
      scrollEnd: 0.82,
      targetFrame: 30
    },
    {
      id: 'scene-13',
      textElementId: 'story-scene-13',
      scrollStart: 0.82,
      scrollEnd: 0.88,
      targetFrame: 35
    },
    {
      id: 'scene-14',
      textElementId: 'story-scene-14',
      scrollStart: 0.88,
      scrollEnd: 0.94,
      targetFrame: 45
    },
    {
      id: 'scene-15',
      textElementId: 'story-scene-15',
      scrollStart: 0.94,
      scrollEnd: 1.00,
      targetFrame: 51
    }
  ],

  getFrameForProgress(progress) {
    let lower = this.scenes[0];
    let upper = this.scenes[this.scenes.length - 1];

    for (let i = 0; i < this.scenes.length - 1; i++) {
      if (progress >= this.scenes[i].scrollStart && progress <= this.scenes[i + 1].scrollStart) {
        lower = this.scenes[i];
        upper = this.scenes[i + 1];
        break;
      }
    }

    const range = upper.scrollStart - lower.scrollStart;
    if (range <= 0) return lower.targetFrame;

    const t = (progress - lower.scrollStart) / range;
    return lower.targetFrame + t * (upper.targetFrame - lower.targetFrame);
  }
};
