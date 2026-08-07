import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from '../theme';

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Track = styled.div`
  border-top: 1px solid ${colors.ink10};
  border-bottom: 1px solid ${colors.ink10};
  padding: 16px 0;
  overflow: hidden;
  white-space: nowrap;
  background: ${colors.bgSoft};
`;

const Scroller = styled.div`
  display: inline-block;
  animation: ${marquee} 26s linear infinite;
`;

const Item = styled.span`
  font-family: ${fonts.mono};
  font-size: 14px;
  letter-spacing: 1.5px;
  color: ${colors.ink50};
  padding: 0 20px;

  span {
    color: ${colors.gold};
  }
`;

const ITEMS = [
  'MACHINE LEARNING', 'RAG PIPELINES', 'LANGGRAPH AGENTS', 'MLOPS',
  'LLMS', 'KUBERNETES', 'VECTOR SEARCH', 'GENERATIVE AI',
];

const MarqueeTicker = () => (
  <Track>
    <Scroller>
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <Item key={i}>{item} <span>/</span></Item>
      ))}
    </Scroller>
  </Track>
);

export default MarqueeTicker;
