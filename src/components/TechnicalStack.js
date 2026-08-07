import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import techStackData from '../data/techStack.json';
import { colors, fonts } from '../theme';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 48px;

  @media (max-width: 760px) {
    padding: 60px 20px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin-bottom: 48px;
`;

const Cloud = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${colors.ink70};
  background: ${colors.ink02};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 10px 16px;
  font-family: ${fonts.mono};
  animation: ${float} 3.2s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${colors.gold};
    color: ${colors.goldDark};
  }

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
`;

const DELAYS = [0, 0.3, 0.6, 0.9, 1.2];

const TechnicalStack = () => {
  const { t } = useTranslation();

  return (
    <Section id="stack">
      <Eyebrow>{t('stack.scene')}</Eyebrow>
      <Heading>{t('stack.heading')}</Heading>
      <Rule />
      <Cloud>
        {techStackData.map((tool, i) => (
          <Chip key={tool.name} $delay={DELAYS[i % DELAYS.length]}>
            <img src={tool.icon} alt="" />
            {tool.name}
          </Chip>
        ))}
      </Cloud>
    </Section>
  );
};

export default TechnicalStack;
