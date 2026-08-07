import { computeScrollFraction, computeSectionProgress } from './scrollMath';

describe('computeScrollFraction', () => {
  test('returns 0 at the top of the page', () => {
    expect(computeScrollFraction(0, 3000, 800)).toBe(0);
  });

  test('returns 1 at the bottom of the page', () => {
    expect(computeScrollFraction(2200, 3000, 800)).toBe(1);
  });

  test('returns a mid fraction halfway down', () => {
    expect(computeScrollFraction(1100, 3000, 800)).toBeCloseTo(0.5);
  });

  test('returns 0 when the page does not scroll (short content)', () => {
    expect(computeScrollFraction(0, 500, 800)).toBe(0);
  });
});

describe('computeSectionProgress', () => {
  const viewportHeight = 800;

  test('is 0 before the section enters the reveal zone', () => {
    expect(computeSectionProgress(2000, 1600, viewportHeight)).toBe(0);
  });

  test('is 1 once the section has scrolled most of the way past', () => {
    expect(computeSectionProgress(-1600, 1600, viewportHeight)).toBe(1);
  });

  test('is a fraction between 0 and 1 while scrolling through the section', () => {
    const progress = computeSectionProgress(200, 1600, viewportHeight);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });
});
