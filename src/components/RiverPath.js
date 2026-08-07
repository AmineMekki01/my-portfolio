import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../theme';
import { buildRiverPath, getRiverPoint, cubic } from '../utils/riverPath';
import { computeSectionProgress } from '../utils/scrollMath';

const Wrap = styled.div`
  position: absolute;
  inset: 0 auto 0 50%;
  transform: translateX(-50%);
  width: 300px  ;
  pointer-events: none;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const paddleRight = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  45% { transform: rotate(15deg); }
  70% { transform: rotate(7deg); }
`;

const paddleLeft = keyframes`
  0%, 100% { transform: rotate(5deg); }
  45% { transform: rotate(-15deg); }
  70% { transform: rotate(-7deg); }
`;

const kickLeft = keyframes`
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(7deg); }
`;

const kickRight = keyframes`
  0%, 100% { transform: rotate(4deg); }
  50% { transform: rotate(-7deg); }
`;

const bodyGlide = keyframes`
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(1.2px); }
`;

const disturbWater = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -12px; }
`;

const LeftArm = styled.path`
  transform-box: view-box;
  transform-origin: 20px 29px;
  animation: ${paddleLeft} 0.78s cubic-bezier(0.45, 0, 0.25, 1) infinite;
  animation-play-state: ${({ $moving }) => ($moving ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const RightArm = styled.path`
  transform-box: view-box;
  transform-origin: 28px 29px;
  animation: ${paddleRight} 0.78s cubic-bezier(0.45, 0, 0.25, 1) infinite;
  animation-play-state: ${({ $moving }) => ($moving ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LeftLeg = styled.path`
  transform-box: view-box;
  transform-origin: 21px 26px;
  animation: ${kickLeft} 0.78s cubic-bezier(0.45, 0, 0.25, 1) infinite;
  animation-play-state: ${({ $moving }) => ($moving ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const RightLeg = styled.path`
  transform-box: view-box;
  transform-origin: 27px 26px;
  animation: ${kickRight} 0.78s cubic-bezier(0.45, 0, 0.25, 1) infinite;
  animation-play-state: ${({ $moving }) => ($moving ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const SwimmerBody = styled.g`
  transform-box: view-box;
  transform-origin: 24px 36px;
  animation: ${bodyGlide} 0.78s cubic-bezier(0.45, 0, 0.25, 1) infinite;
  animation-play-state: ${({ $moving }) => ($moving ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const WaterRipple = styled.path`
  stroke-dasharray: 7px 5px;
  opacity: ${({ $moving }) => ($moving ? 0.85 : 0.22)};
  animation: ${disturbWater} 0.7s linear infinite;
  animation-play-state: ${({ $moving }) => ($moving ? 'running' : 'paused')};
  transition: opacity 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Swimmer = styled.svg`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: 34px;
  height: 47px;
  overflow: visible;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translate(-50%, -80%) rotate(${({ $angle }) => $angle}deg);
  transform-origin: 50% 80%;
  filter: drop-shadow(0 4px 5px rgba(20, 18, 16, 0.22));
  transition: left 0.28s cubic-bezier(0.22, 0.7, 0.25, 1), top 0.28s cubic-bezier(0.22, 0.7, 0.25, 1), transform 0.2s ease-out, opacity 0.15s ease;
  will-change: left, top, transform;
  z-index: 1;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const fishLeap = keyframes`
  0% { opacity: 0; transform: translate(0, 5px) rotate(var(--launch-angle)) scale(0.68); }
  12% { opacity: 1; }
  48% { opacity: 1; transform: translate(var(--jump-x), -42px) rotate(0deg) scale(1); }
  78% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--land-x), 5px) rotate(var(--dive-angle)) scale(0.72); }
`;

const splashBurst = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.35); }
  14% { opacity: 0.9; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.45); }
`;

const FishEvent = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: 48px;
  height: 36px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 3;
`;

const JumpingFish = styled.svg`
  --jump-x: ${({ $side }) => ($side < 0 ? '-32px' : '32px')};
  --land-x: ${({ $side }) => ($side < 0 ? '-20px' : '20px')};
  --launch-angle: ${({ $side }) => ($side < 0 ? '38deg' : '-38deg')};
  --dive-angle: ${({ $side }) => ($side < 0 ? '-42deg' : '42deg')};
  position: absolute;
  inset: 0;
  width: 48px;
  height: 32px;
  overflow: visible;
  filter: drop-shadow(0 3px 3px rgba(20, 18, 16, 0.2));
  animation: ${fishLeap} 1.15s cubic-bezier(0.3, 0.7, 0.25, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.9;
    transform: translate(var(--jump-x), -24px);
  }
`;

const FishSplash = styled.svg`
  position: absolute;
  left: 50%;
  top: 55%;
  width: 58px;
  height: 28px;
  overflow: visible;
  animation: ${splashBurst} 0.9s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const BankPlant = styled.svg`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: 38px;
  height: 34px;
  overflow: visible;
  opacity: ${({ $visible }) => ($visible ? 0.84 : 0)};
  transform: translate(-50%, -50%) scale(${({ $scale }) => $scale}) scaleX(${({ $side }) => $side});
  transform-origin: center;
  filter: drop-shadow(0 2px 2px rgba(20, 18, 16, 0.12));
  transition: opacity 0.35s ease;
`;

const BANK_PLANTS = [
  { progress: 0.06, side: -1, scale: 0.78, type: 'bush' },
  { progress: 0.14, side: 1, scale: 0.62, type: 'reeds' },
  { progress: 0.23, side: -1, scale: 0.66, type: 'rocks' },
  { progress: 0.31, side: 1, scale: 0.84, type: 'bush' },
  { progress: 0.4, side: -1, scale: 0.7, type: 'reeds' },
  { progress: 0.49, side: 1, scale: 0.92, type: 'bush' },
  { progress: 0.58, side: 1, scale: 0.6, type: 'rocks' },
  { progress: 0.66, side: -1, scale: 0.8, type: 'bush' },
  { progress: 0.75, side: 1, scale: 0.7, type: 'reeds' },
  { progress: 0.83, side: -1, scale: 0.86, type: 'bush' },
  { progress: 0.91, side: 1, scale: 0.64, type: 'rocks' },
  { progress: 0.97, side: -1, scale: 0.72, type: 'reeds' },
];

const RIVER_BASE_LAYERS = [
  { stroke: colors.bankSand, strokeWidth: 154, strokeOpacity: 0.2, strokeLinejoin: 'round' },
  { stroke: colors.bankSage, strokeWidth: 138, strokeOpacity: 0.11, strokeLinejoin: 'round' },
  { stroke: 'url(#riverBodyGradient)', strokeWidth: 120, strokeOpacity: 0.07, strokeLinejoin: 'round' },
  { stroke: 'url(#riverBodyGradient)', strokeWidth: 100, strokeOpacity: 0.17, strokeLinejoin: 'round' },
  { stroke: 'url(#riverBodyGradient)', strokeWidth: 90, strokeLinejoin: 'round' },
  { stroke: colors.riverBright, strokeWidth: 60, strokeOpacity: 0.12, strokeLinejoin: 'round' },
  { stroke: colors.riverLight, strokeWidth: 50, strokeOpacity: 0.1, strokeLinejoin: 'round' },
  { stroke: colors.riverBright, strokeWidth: 34, strokeOpacity: 0.09, strokeLinejoin: 'round' },
];

// Dashed foam/highlight streaks read as noisy clutter right where the river
// meets the lake, so they're kept out of the bridge via riverTextureMask
// (see render) and only fade in once the body proper begins.
const RIVER_TEXTURE_LAYERS = [
  { stroke: colors.riverFoam, strokeWidth: 2.6, strokeOpacity: 0.28, strokeDasharray: '38 66', strokeDashoffset: 12, transform: 'translate(-6 0)' },
  { stroke: colors.riverLight, strokeWidth: 1.9, strokeOpacity: 0.3, strokeDasharray: '18 54', strokeDashoffset: 31, transform: 'translate(7 0)' },
  { stroke: colors.riverFoam, strokeWidth: 1.2, strokeOpacity: 0.2, strokeDasharray: '62 92', strokeDashoffset: 8, transform: 'translate(-1 0)' },
];

const RiverLayers = ({ d, layers }) => (
  <>
    {layers.map((layer, i) => (
      <path key={i} d={d} fill="none" strokeLinecap="butt" vectorEffect="non-scaling-stroke" {...layer} />
    ))}
  </>
);

function findLakeExitPoint() {
  const lakePath = document.querySelector('#top svg path[fill="url(#heroLake)"]');
  if (!lakePath || typeof lakePath.getScreenCTM !== 'function') return null;
  const ctm = lakePath.getScreenCTM();
  if (!ctm) return null;

  const length = lakePath.getTotalLength();
  let lowest = null;
  for (let i = 0; i <= 60; i++) {
    const point = lakePath.getPointAtLength((length * i) / 60);
    if (!lowest || point.y > lowest.y) lowest = point;
  }
  const screenPoint = lowest.matrixTransform(ctm);
  return { x: screenPoint.x, y: screenPoint.y };
}

const RiverPath = ({ nodeCount, progress }) => {
  const wrapRef = useRef(null);
  const previousProgress = useRef(Number.isFinite(progress) ? progress : 0);
  const previousFishProgress = useRef(Number.isFinite(progress) ? progress : 0);
  const fishSequence = useRef(0);
  const [aspectRatio, setAspectRatio] = useState(0.12);
  const [bridge, setBridge] = useState({ overlapUnits: 0, exitUnitX: 50 });
  const [extendedReveal, setExtendedReveal] = useState(0);
  const [motion, setMotion] = useState({ moving: false, direction: 1 });
  const [fishJump, setFishJump] = useState(null);
  const bodyPath = buildRiverPath(nodeCount);

  const bandHeight = nodeCount > 0 ? 100 / nodeCount : 100;
  const tangentX = 32;
  const tangentY = bandHeight * 0.25;
  const joinScale = bridge.overlapUnits > 0.5 ? (bridge.overlapUnits * 0.16) / tangentY : 0;
  const hasBridge = bridge.overlapUnits > 0.5;
  const bridgePoints = {
    start: { x: bridge.exitUnitX, y: -bridge.overlapUnits },
    c1: { x: bridge.exitUnitX - (bridge.exitUnitX - 50) * 0.35, y: -bridge.overlapUnits * 0.6 },
    c2: { x: 50 + tangentX * joinScale, y: -tangentY * joinScale },
    end: { x: 50, y: 0 },
  };
  const bridgeD = hasBridge
    ? `M${bridgePoints.start.x},${bridgePoints.start.y} C${bridgePoints.c1.x},${bridgePoints.c1.y} ${bridgePoints.c2.x},${bridgePoints.c2.y} ${bridgePoints.end.x},${bridgePoints.end.y}`
    : '';
  const getBridgePoint = (t) => ({
    x: cubic(bridgePoints.start.x, bridgePoints.c1.x, bridgePoints.c2.x, bridgePoints.end.x, t),
    y: cubic(bridgePoints.start.y, bridgePoints.c1.y, bridgePoints.c2.y, bridgePoints.end.y, t),
  });
  // How much of the swimmer's overall travel (0-1) is spent crossing the bridge
  // before entering the journey body, sized to the bridge's actual share of the
  // combined visual length so the pacing matches however long it currently is.
  const bridgeShare = hasBridge ? bridge.overlapUnits / (bridge.overlapUnits + 100) : 0;
  const getSwimmerPoint = (extendedProgress) => {
    const clamped = Math.min(Math.max(extendedProgress, 0), 1);
    if (hasBridge && clamped < bridgeShare) {
      return getBridgePoint(bridgeShare > 0 ? clamped / bridgeShare : 1);
    }
    const bodyProgress = bridgeShare < 1 ? (clamped - bridgeShare) / (1 - bridgeShare) : 0;
    return getRiverPoint(nodeCount, bodyProgress);
  };
  // Bridge and body are kept as ONE continuous path (not two separately-stroked
  // paths) so SVG's own line-join renders the seam perfectly, no matter the
  // tangent — two independently butt-capped strokes only tile without a gap if
  // their angles match exactly, which an approximated join can't guarantee.
  const d = bridgeD ? bridgeD + bodyPath.replace(/^M50,0/, '') : bodyPath;
  const reveal = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0;
  const swimmerReveal = Number.isFinite(extendedReveal) ? Math.min(Math.max(extendedReveal, 0), 1) : 0;

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return undefined;

    const update = () => {
      const rect = element.getBoundingClientRect();
      if (rect.height <= 0) return;
      setAspectRatio(rect.width / rect.height);

      const exit = findLakeExitPoint();
      if (!exit) return;
      const gapPx = rect.top - exit.y + 26;
      const wrapCenterX = (rect.left + rect.width / 2) - 15;
      setBridge({
        overlapUnits: Math.max(gapPx, 0) * 100 / rect.height,
        exitUnitX: 50 + ((exit.x - wrapCenterX) / rect.width) * 100,
      });
    };

    const observer = window.ResizeObserver ? new window.ResizeObserver(update) : null;
    observer?.observe(element);
    window.addEventListener('resize', update);
    update();
    const settle = window.setTimeout(update, 300);
    document.fonts?.ready?.then(update);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.clearTimeout(settle);
    };
  }, []);

  // `progress` (via useSectionScrollProgress) only tracks scroll through
  // PathWrap's own box, which starts below the bridge — so it stays at 0 while
  // the user scrolls through the bridge/lake area, and the swimmer sits frozen
  // there until PathWrap's top finally crosses the reveal line, well after the
  // user has already scrolled past it. Track a second progress value over the
  // bridge+body combined height so the swimmer's motion starts as soon as the
  // bridge itself scrolls into the reveal zone, not just the body below it.
  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return undefined;

    let frame = null;
    const updateReveal = () => {
      const rect = element.getBoundingClientRect();
      if (rect.height > 0) {
        const bridgeHeightPx = (bridge.overlapUnits / 100) * rect.height;
        setExtendedReveal(computeSectionProgress(
          rect.top - bridgeHeightPx,
          rect.height + bridgeHeightPx,
          window.innerHeight
        ));
      }
      frame = null;
    };
    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateReveal);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [bridge.overlapUnits]);

  // Track direction off the same extended-progress signal that drives the
  // swimmer's actual position (swimmerReveal), not `reveal` — `reveal` stays
  // pinned at 0 while scrolling through the bridge (it's scoped to PathWrap,
  // which starts below the bridge), so direction-flip detection would go
  // silent up there and keep showing whatever direction was last set in the
  // body below.
  useEffect(() => {
    const delta = swimmerReveal - previousProgress.current;
    previousProgress.current = swimmerReveal;
    if (Math.abs(delta) < 0.0001) return undefined;

    const direction = delta > 0 ? 1 : -1;
    setMotion((current) => current.moving && current.direction === direction
      ? current
      : { moving: true, direction });
    const timer = window.setTimeout(() => {
      setMotion((current) => ({ ...current, moving: false }));
    }, 420);

    return () => window.clearTimeout(timer);
  }, [swimmerReveal]);

  useEffect(() => {
    const previous = previousFishProgress.current;
    previousFishProgress.current = reveal;
    if (nodeCount < 2 || reveal <= previous) return;

    let reachedIndex = null;
    for (let index = 1; index < nodeCount; index++) {
      const trigger = index / nodeCount + 0.012;
      if (previous < trigger && reveal >= trigger) reachedIndex = index;
    }

    if (reachedIndex !== null) {
      fishSequence.current += 1;
      setFishJump({ index: reachedIndex, sequence: fishSequence.current });
    }
  }, [nodeCount, reveal]);

  useEffect(() => {
    if (!fishJump) return undefined;
    const timer = window.setTimeout(() => setFishJump(null), 1250);
    return () => window.clearTimeout(timer);
  }, [fishJump]);

  // The path bends diagonally throughout (toward each node's left/right bend), so
  // a fade window that's narrow relative to the wide halo strokes' diagonal reach
  // clips a wedge out of them wherever the reveal boundary currently sits, not
  // just at the start. Keep the fade wide enough to cover that reach smoothly.
  const revealPct = reveal * 100;
  const effectiveRevealPct = revealPct > 0 ? Math.max(revealPct, 16) : 0;
  const fadeStartPct = Math.max(effectiveRevealPct - 16, 0);
  const complete = reveal >= 0.999;
  const visibleOpacity = reveal > 0 ? 1 : 0;
  const swimmerProgress = Math.max(swimmerReveal - 0.012, 0);
  const swimmer = getSwimmerPoint(swimmerProgress);
  const previousPoint = getSwimmerPoint(Math.max(swimmerProgress - 0.002, 0));
  const nextPoint = getSwimmerPoint(Math.min(swimmerProgress + 0.002, 1));
  const tangentAngle = -Math.atan2(
    (nextPoint.x - previousPoint.x) * aspectRatio,
    nextPoint.y - previousPoint.y
  ) * 180 / Math.PI;
  const swimmerAngle = tangentAngle + (motion.direction < 0 ? 180 : 0);
  const plants = BANK_PLANTS.map((plant) => {
    const point = getRiverPoint(nodeCount, plant.progress);
    return { ...plant, x: point.x + plant.side * 25, y: point.y };
  });
  const fishPoint = fishJump ? getRiverPoint(nodeCount, fishJump.index / nodeCount) : null;
  const fishSide = fishJump?.index % 2 === 1 ? -1 : 1;
  const gradientTop = hasBridge ? -bridge.overlapUnits : 0;
  const gradientSpan = 100 - gradientTop;
  const offsetAt = (y) => `${((y - gradientTop) / gradientSpan) * 100}%`;

  return (
    <Wrap ref={wrapRef} aria-hidden="true">
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" shapeRendering="geometricPrecision">
        <defs>
          <linearGradient id="riverBodyGradient" gradientUnits="userSpaceOnUse" x1="50" y1={gradientTop} x2="50" y2="100">
            {hasBridge && <stop offset="0%" stopColor={colors.linkedToLake} />}
            <stop offset={offsetAt(0)} stopColor={colors.riverDeep} />
            <stop offset={offsetAt(38)} stopColor={colors.riverMid} />
            <stop offset={offsetAt(72)} stopColor={colors.riverBright} />
            <stop offset="100%" stopColor={colors.riverLight} />
          </linearGradient>
          <linearGradient id="riverRevealGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0%" stopColor="white" stopOpacity={visibleOpacity} />
            <stop offset={`${fadeStartPct}%`} stopColor="white" stopOpacity={visibleOpacity} />
            <stop offset={`${effectiveRevealPct}%`} stopColor="white" stopOpacity={complete ? 1 : 0} />
            <stop offset="100%" stopColor="white" stopOpacity={complete ? 1 : 0} />
          </linearGradient>
          <linearGradient id="riverTextureFade" gradientUnits="userSpaceOnUse" x1="50" y1={gradientTop} x2="50" y2="22">
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <mask id="riverTextureMask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="-20" y={gradientTop - 5} width="140" height={100 - gradientTop + 10}>
            <rect x="-20" y={gradientTop - 5} width="140" height={100 - gradientTop + 10} fill="url(#riverTextureFade)" />
          </mask>
        </defs>

        <g mask="url(#riverReveal)">
          <RiverLayers d={d} layers={RIVER_BASE_LAYERS} />
          <g mask="url(#riverTextureMask)">
            <RiverLayers d={d} layers={RIVER_TEXTURE_LAYERS} />
          </g>
        </g>
      </Svg>
      {plants.map((plant) => (
        <BankPlant
          key={plant.progress}
          viewBox="0 0 28 24"
          $x={plant.x}
          $y={plant.y}
          $side={plant.side}
          $scale={plant.scale}
          $visible={reveal > plant.progress - 0.015}
        >
          {plant.type === 'bush' && (
            <>
              <ellipse cx="14" cy="21" rx="11" ry="2.5" fill={colors.bankSand} fillOpacity="0.42" />
              <circle cx="7" cy="15" r="5.5" fill={colors.bankLeaf} />
              <circle cx="14" cy="10" r="7" fill={colors.bankSage} />
              <circle cx="21" cy="16" r="5.5" fill={colors.bankLeaf} />
              <circle cx="13" cy="16" r="6" fill={colors.bankSage} />
            </>
          )}
          {plant.type === 'reeds' && (
            <>
              <ellipse cx="14" cy="22" rx="9" ry="2" fill={colors.bankSand} fillOpacity="0.5" />
              <path d="M14 22 C13 14 8 8 5 3 M14 22 C15 13 21 7 24 2 M14 22 C14 12 15 6 17 1 M12 22 C10 15 10 9 11 5" fill="none" stroke={colors.bankLeaf} strokeWidth="2" strokeLinecap="round" />
              <path d="M5 3 L3 6 M24 2 L26 5 M17 1 L19 4" fill="none" stroke={colors.bankSage} strokeWidth="2.4" strokeLinecap="round" />
            </>
          )}
          {plant.type === 'rocks' && (
            <>
              <ellipse cx="14" cy="21" rx="11" ry="2.5" fill={colors.ink15} />
              <ellipse cx="8" cy="17" rx="5.5" ry="4" fill={colors.bankSand} />
              <ellipse cx="16" cy="14" rx="7" ry="5.5" fill={colors.ink15} />
              <ellipse cx="22" cy="18" rx="4.5" ry="3.5" fill={colors.goldFaint} />
            </>
          )}
        </BankPlant>
      ))}
      {fishJump && fishPoint && (
        <FishEvent key={fishJump.sequence} $x={fishPoint.x} $y={fishPoint.y}>
          <FishSplash viewBox="0 0 58 28">
            <ellipse cx="29" cy="18" rx="19" ry="5" fill="none" stroke={colors.riverFoam} strokeWidth="2" strokeOpacity="0.78" />
            <path d="M13 17 L8 10 M22 14 L20 6 M37 14 L39 6 M45 17 L50 10" fill="none" stroke={colors.riverFoam} strokeWidth="2" strokeLinecap="round" />
          </FishSplash>
          <JumpingFish viewBox="0 0 48 32" $side={fishSide}>
            <g transform={fishSide < 0 ? 'translate(48 0) scale(-1 1)' : undefined}>
              <path d="M9 16 C15 6 33 5 41 16 C33 27 15 26 9 16Z" fill={colors.riverLight} stroke={colors.riverDeep} strokeWidth="1.5" />
              <path d="M10 16 L2 8 L3 24Z" fill={colors.gold} stroke={colors.riverDeep} strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M23 11 C19 7 18 4 20 2 C25 5 28 8 29 11Z" fill={colors.riverBright} fillOpacity="0.8" />
              <path d="M23 21 C20 25 20 28 22 30 C26 27 29 24 30 21Z" fill={colors.riverBright} fillOpacity="0.72" />
              <circle cx="36" cy="13" r="1.5" fill={colors.ink} />
              <circle cx="36.4" cy="12.6" r="0.45" fill={colors.bg} />
            </g>
          </JumpingFish>
        </FishEvent>
      )}
      <Swimmer viewBox="0 0 48 68" $x={swimmer.x} $y={swimmer.y} $angle={swimmerAngle} $visible={hasBridge || reveal > 0.02}>
        <WaterRipple $moving={motion.moving} d="M19 -18 C22 -16 26 -16 29 -18" fill="none" stroke={colors.riverFoam} strokeWidth="1.2" strokeLinecap="round" />
        <WaterRipple $moving={motion.moving} d="M16 -10 C21 -7 27 -7 32 -10" fill="none" stroke={colors.riverFoam} strokeWidth="1.4" strokeLinecap="round" />
        <WaterRipple $moving={motion.moving} d="M14 -2 C20 2 28 2 34 -2" fill="none" stroke={colors.riverLight} strokeWidth="1.6" strokeLinecap="round" />
        <WaterRipple $moving={motion.moving} d="M14 5 C20 8 28 8 34 5" fill="none" stroke={colors.riverFoam} strokeWidth="2" strokeLinecap="round" />
        <WaterRipple $moving={motion.moving} d="M10 11 C18 15 30 15 38 11" fill="none" stroke={colors.riverFoam} strokeWidth="1.8" strokeLinecap="round" />
        <WaterRipple $moving={motion.moving} d="M8 18 C17 23 31 23 40 18" fill="none" stroke={colors.riverLight} strokeWidth="1.5" strokeLinecap="round" />
        <SwimmerBody $moving={motion.moving}>
          <LeftLeg $moving={motion.moving} d="M21 26 C20 20 18 14 17 8 L14 4" fill="none" stroke="#d39a68" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <RightLeg $moving={motion.moving} d="M27 26 C28 20 30 14 31 8 L34 4" fill="none" stroke="#d39a68" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <LeftArm $moving={motion.moving} d="M20 29 C13 27 10 34 6 40 C9 44 13 46 18 48" fill="none" stroke="#d39a68" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <RightArm $moving={motion.moving} d="M28 29 C35 27 38 34 42 40 C39 44 35 46 30 48" fill="none" stroke="#d39a68" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 20 C18 23 17 34 20 43 L28 43 C31 34 30 23 24 20Z" fill={colors.bg} stroke={colors.ink} strokeWidth="1.4" />
          <circle cx="24" cy="54" r="7" fill="#d39a68" stroke={colors.bg} strokeWidth="1.6" />
          <path d="M17.4 53 A7 7 0 0 1 30.6 53 C27.3 49.2 20.7 49.2 17.4 53Z" fill={colors.gold} />
        </SwimmerBody>
        <WaterRipple $moving={motion.moving} d="M3 41 C8 47 13 50 18 48 M30 48 C35 50 40 47 45 41" fill="none" stroke={colors.riverFoam} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="7" cy="33" r="1.4" fill={colors.riverFoam} fillOpacity={motion.moving ? 0.78 : 0.22} />
        <circle cx="41" cy="31" r="1.2" fill={colors.riverFoam} fillOpacity={motion.moving ? 0.7 : 0.2} />
      </Swimmer>
    </Wrap>
  );
};

export default RiverPath;
