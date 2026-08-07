export function computeScrollFraction(scrollY, scrollHeight, viewportHeight) {
  const max = scrollHeight - viewportHeight;
  if (max <= 0) return 0;
  const fraction = scrollY / max;
  return Math.min(Math.max(fraction, 0), 1);
}

export function computeSectionProgress(rectTop, rectHeight, viewportHeight) {
  if (rectHeight <= 0) return 0;
  const revealLine = viewportHeight * 0.85;
  const raw = (revealLine - rectTop) / rectHeight;
  return Math.min(Math.max(raw, 0), 1);
}
