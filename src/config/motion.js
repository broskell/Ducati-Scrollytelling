// Design System: Motion Timing, Easing, and Momentum Configuration
export const MOTION = {
  easings: {
    reveal: 'power3.out',      // cubic-bezier(0.215, 0.61, 0.355, 1)
    transition: 'power2.inOut', // cubic-bezier(0.77, 0, 0.175, 1)
    micro: 'power1.out'        // cubic-bezier(0.25, 0.46, 0.45, 0.94)
  },
  durations: {
    content: 1.2,              // in seconds
    transition: 0.8,
    micro: 0.3
  },
  lerpFactor: 0.06,            // default momentum smoothing coefficient
  lerpFactorReduced: 0.25,      // snappy snap when reduced motion is preferred
  mouseDriftX: 3.5,            // horizontal camera float boundary
  mouseDriftY: 2.0             // vertical camera float boundary
};
