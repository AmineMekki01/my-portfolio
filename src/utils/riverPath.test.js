import { buildRiverPath, getRiverPoint } from './riverPath';

describe('buildRiverPath', () => {
  test('starts at the top center and ends at the bottom center', () => {
    const d = buildRiverPath(3);
    expect(d.startsWith('M50,0')).toBe(true);
    expect(d.trim().endsWith('50,100')).toBe(true);
  });

  test('has one cubic bezier segment per node', () => {
    const d = buildRiverPath(4);
    const segments = d.split('C').length - 1;
    expect(segments).toBe(4);
  });

  test('alternates bend direction between consecutive nodes', () => {
    const d = buildRiverPath(2);
    expect(d).toContain('82,');
    expect(d).toContain('18,');
  });

  test('falls back to a straight line for zero nodes', () => {
    expect(buildRiverPath(0)).toBe('M50,0 L50,100');
  });
});

describe('getRiverPoint', () => {
  test('starts and finishes at the river endpoints', () => {
    expect(getRiverPoint(4, 0)).toEqual({ x: 50, y: 0 });
    expect(getRiverPoint(4, 1)).toEqual({ x: 50, y: 100 });
  });

  test('lands at the center for every milestone', () => {
    for (let i = 0; i <= 4; i++) {
      const point = getRiverPoint(4, i / 4);
      expect(point.x).toBeCloseTo(50);
      expect(point.y).toBeCloseTo(i * 25);
    }
  });

  test('follows alternating river bends between milestones', () => {
    expect(getRiverPoint(2, 0.25).x).toBeLessThan(50);
    expect(getRiverPoint(2, 0.75).x).toBeGreaterThan(50);
  });

  test('keeps vertical travel synchronized with scroll progress', () => {
    expect(getRiverPoint(6, 0.37).y).toBeCloseTo(37);
  });
});
