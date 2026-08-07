export function cubic(start, control1, control2, end, t) {
  const inverse = 1 - t;
  return inverse ** 3 * start
    + 3 * inverse ** 2 * t * control1
    + 3 * inverse * t ** 2 * control2
    + t ** 3 * end;
}

function solveRiverTime(progress) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  let low = 0;
  let high = 1;

  for (let i = 0; i < 12; i++) {
    const middle = (low + high) / 2;
    if (cubic(0, 0.25, 0.75, 1, middle) < progress) low = middle;
    else high = middle;
  }

  return (low + high) / 2;
}

export function buildRiverPath(nodeCount) {
  if (nodeCount <= 0) return 'M50,0 L50,100';

  const bandHeight = 100 / nodeCount;
  const points = [];

  for (let i = 0; i < nodeCount; i++) {
    const bandStart = i * bandHeight;
    const bandEnd = bandStart + bandHeight;
    const bendX = i % 2 === 0 ? 18 : 82;
    points.push({ x: bendX, y: bandStart + bandHeight * 0.25 });
    points.push({ x: bendX, y: bandStart + bandHeight * 0.75 });
    points.push({ x: 50, y: bandEnd });
  }

  let d = 'M50,0';
  for (let i = 0; i < points.length; i += 3) {
    const c1 = points[i];
    const c2 = points[i + 1];
    const end = points[i + 2];
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;
  }
  return d;
}

export function getRiverPoint(nodeCount, progress) {
  if (nodeCount <= 0) return { x: 50, y: 0 };

  const clamped = Math.min(Math.max(progress, 0), 1);
  const scaled = clamped * nodeCount;
  const segment = Math.min(Math.floor(scaled), nodeCount - 1);
  const segmentProgress = clamped === 1 ? 1 : scaled - segment;
  const t = solveRiverTime(segmentProgress);
  const bendX = segment % 2 === 0 ? 18 : 82;

  return {
    x: cubic(50, bendX, bendX, 50, t),
    y: clamped * 100,
  };
}
