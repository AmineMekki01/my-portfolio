import React from 'react';
import styled from 'styled-components';
import { colors } from '../theme';

const Scene = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 900px) {
    opacity: 0.42;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const Illustration = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const UPSTREAM = 'M86,-5 C86,2 85,7 84,12';
const WATERFALL = 'M80,12 C79,25 80,41 78,63 C80,68 87,68 89,63 C87,43 89,25 88,12Z';
const LAKE_OUTER = 'M59,68 C64,61 75,59 85,61 C96,63 101,70 97,77 C94,82 87,85 79,85 C72,88 64,87 65,82 C59,81 55,75 59,68Z';
const LAKE_INNER = 'M61,68 C67,63 77,62 86,64 C95,66 98,72 94,77 C90,81 84,83 77,83 C70,86 63,85 66,81 C61,79 58,74 61,68Z';
const LAKE_WATER = 'M63,69 C69,64 78,64 87,66 C94,68 96,73 92,77 C88,80 82,82 76,81 C70,84 63,83 67,80 C62,78 60,74 63,69Z';

const HeroWaterfall = () => (
  <Scene aria-hidden="true">
    <Illustration viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id="heroUpstream" gradientUnits="userSpaceOnUse" x1="86" y1="0" x2="84" y2="13">
          <stop offset="0%" stopColor={colors.riverDeep} />
          <stop offset="100%" stopColor={colors.riverBright} />
        </linearGradient>
        <linearGradient id="heroFall" gradientUnits="userSpaceOnUse" x1="84" y1="12" x2="83" y2="67">
          <stop offset="0%" stopColor={colors.riverFoam} />
          <stop offset="24%" stopColor={colors.riverLight} />
          <stop offset="72%" stopColor={colors.riverBright} />
          <stop offset="100%" stopColor={colors.riverMid} />
        </linearGradient>
        <radialGradient id="heroLake" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor={colors.riverLight} />
          <stop offset="52%" stopColor={colors.riverBright} />
          <stop offset="100%" stopColor={colors.riverDeep} />
        </radialGradient>
        <linearGradient id="heroRock" gradientUnits="userSpaceOnUse" x1="67" y1="8" x2="99" y2="67">
          <stop offset="0%" stopColor={colors.bankSand} />
          <stop offset="52%" stopColor={colors.goldFaint} />
          <stop offset="100%" stopColor={colors.bankSage} />
        </linearGradient>
      </defs>

      <path d={UPSTREAM} fill="none" stroke={colors.bankSand} strokeWidth="144" strokeOpacity="0.22" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={UPSTREAM} fill="none" stroke={colors.bankSage} strokeWidth="124" strokeOpacity="0.13" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={UPSTREAM} fill="none" stroke="url(#heroUpstream)" strokeWidth="90" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={UPSTREAM} fill="none" stroke={colors.riverLight} strokeWidth="28" strokeOpacity="0.14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

      <path d="M67 9 C73 6 78 9 83 8 C89 7 96 8 100 11 L100 61 C96 63 93 64 89 65 L88 17 C84 15 80 16 76 17 L73 64 C69 65 66 64 63 62Z" fill="url(#heroRock)" fillOpacity="0.54" />
      <path d="M66 12 C72 10 77 12 82 11 C89 9 95 10 99 13 L97 19 C93 18 90 19 87 20 L76 20 C72 18 68 19 64 20Z" fill={colors.bankSand} fillOpacity="0.84" />
      <path d="M68 27 C71 25 73 26 75 27 M91 28 C94 25 97 26 99 28 M67 43 C70 41 72 42 74 43 M91 45 C94 42 97 43 99 45 M66 57 C69 55 71 56 73 57 M90 59 C94 56 97 57 99 59" fill="none" stroke={colors.goldDark} strokeWidth="1.2" strokeOpacity="0.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M68 13 L66 8 M72 13 L73 6 M94 12 L96 7 M91 13 L90 7" fill="none" stroke={colors.bankLeaf} strokeWidth="1.5" strokeOpacity="0.72" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="69" cy="11" r="1.8" fill={colors.bankLeaf} fillOpacity="0.8" />
      <circle cx="95" cy="12" r="2.2" fill={colors.bankSage} fillOpacity="0.88" />

      <path d={WATERFALL} fill={colors.riverLight} fillOpacity="0.15" stroke={colors.riverFoam} strokeWidth="34" strokeOpacity="0.18" vectorEffect="non-scaling-stroke" />
      <path d={WATERFALL} fill="url(#heroFall)" fillOpacity="0.94" />
      <path d="M80 13 C79 26 80 41 78 63" fill="none" stroke={colors.riverFoam} strokeWidth="6.5" strokeOpacity="0.72" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M83 13 C82 27 84 41 81 64" fill="none" stroke={colors.bg} strokeWidth="2.8" strokeOpacity="0.7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M86 13 C84 28 87 43 84 63" fill="none" stroke={colors.riverFoam} strokeWidth="4" strokeOpacity="0.58" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M78.5 24 C81 27 83 27 86 24 M77.5 39 C80 42 83 42 86 39 M76.5 54 C79 57 82 57 85 54" fill="none" stroke={colors.riverLight} strokeWidth="1.4" strokeOpacity="0.48" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

      <path d={LAKE_OUTER} fill={colors.bankSand} fillOpacity="0.35" />
      <path d={LAKE_INNER} fill={colors.bankSage} fillOpacity="0.22" />
      <path d={LAKE_WATER} fill="url(#heroLake)" />
      <path d="M68 70 C74 67 84 68 89 71 C85 74 74 75 67 72Z" fill={colors.riverFoam} fillOpacity="0.16" />
      <path d="M67 74 C73 71 84 71 91 74 M69 78 C76 76 84 76 89 77" fill="none" stroke={colors.riverFoam} strokeWidth="1.4" strokeOpacity="0.38" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

      <path d="M68 66 C72 62 77 61 81 64 C85 61 91 62 97 66 C93 70 88 71 83 69 C78 72 72 70 68 66Z" fill={colors.riverFoam} fillOpacity="0.52" />
      <ellipse cx="83" cy="66" rx="13" ry="2.5" fill={colors.riverFoam} fillOpacity="0.48" />
      <ellipse cx="83" cy="67" rx="8" ry="1.5" fill={colors.riverLight} fillOpacity="0.55" />
      <path d="M68 66 C73 61 77 62 81 65 M85 65 C89 61 94 62 98 66" fill="none" stroke={colors.riverFoam} strokeWidth="2.4" strokeOpacity="0.78" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M75 64 L72 59 M82 63 L82 57 M90 64 L93 59" fill="none" stroke={colors.riverFoam} strokeWidth="1.6" strokeOpacity="0.66" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx="72" cy="60" r="0.7" fill={colors.riverFoam} />
      <circle cx="93" cy="59" r="0.55" fill={colors.riverFoam} />
    </Illustration>
  </Scene>
);

export default HeroWaterfall;
