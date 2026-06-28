// Design System: Layout Profiles & Viewport Occupancy Configuration
export const LAYOUT = {
  breakpoints: {
    desktop: 1600,
    laptop: 1024,
    tablet: 768,
    mobile: 480
  },

  getProfile(width) {
    if (width > this.breakpoints.desktop) {
      return {
        name: 'desktop',
        occupancyHero: 0.88,
        occupancyExploded: 0.82,
        offsetX: 0.035,      // 3.5% horizontal shift right (breathing space left)
        safeMarginX: 0.05,   // 5% edge padding
        safeMarginY: 0.08    // 8% edge padding
      };
    } else if (width > this.breakpoints.laptop) {
      return {
        name: 'laptop',
        occupancyHero: 0.90,
        occupancyExploded: 0.84,
        offsetX: 0.02,       // 2.0% horizontal shift right
        safeMarginX: 0.05,
        safeMarginY: 0.08
      };
    } else if (width > this.breakpoints.tablet) {
      return {
        name: 'tablet',
        occupancyHero: 0.92,
        occupancyExploded: 0.85,
        offsetX: 0.01,       // 1.0% horizontal shift right
        safeMarginX: 0.03,
        safeMarginY: 0.05
      };
    } else {
      return {
        name: 'mobile',
        occupancyHero: 0.94,
        occupancyExploded: 0.86,
        offsetX: 0.0,
        safeMarginX: 0.02,
        safeMarginY: 0.03
      };
    }
  }
};
