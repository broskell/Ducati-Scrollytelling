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
      scrollEnd: 0.12,
      targetFrame: 1
    },
    {
      id: 'scene-15',
      textElementId: 'story-scene-15',
      scrollStart: 0.88,
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
