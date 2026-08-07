import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../theme';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 240px 1fr;
  margin-bottom: 64px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(28px)')};
  transition: opacity 0.7s ease, transform 0.7s ease;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding-left: 40px;
    border-left: 2px dashed ${colors.ink15};
    margin-bottom: 48px;
  }
`;

const Dot = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ $current }) => ($current ? colors.gold : colors.bg)};
  border: 2px solid ${colors.gold};
  box-shadow: 0 0 0 5px ${colors.bg}, 0 0 12px rgba(156, 122, 63, 0.45);
  animation: ${({ $current }) => ($current ? 'journeyPulse 1.8s ease-in-out infinite' : 'none')};

  @keyframes journeyPulse {
    0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.6; transform: translateX(-50%) scale(0.85); }
  }

  @media (max-width: 760px) {
    left: -41px;
    transform: none;
  }
`;

const Connector = styled.div`
  position: absolute;
  top: 16px;
  ${({ $side }) => ($side === 'left' ? 'right' : 'left')}: calc(50% + 22px);
  width: ${({ $visible }) => ($visible ? '76px' : '0px')};
  height: 1px;
  border-top: 2px dashed rgba(156, 122, 63, 0.5);
  transition: width 0.6s ease 0.15s;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Card = styled.div`
  position: relative;
  grid-column: ${({ $side }) => ($side === 'left' ? 1 : 3)};
  text-align: ${({ $side }) => ($side === 'left' ? 'right' : 'left')};
  ${({ $side }) => ($side === 'left' ? 'padding-right: 14px;' : 'padding-left: 14px;')}

  @media (max-width: 760px) {
    grid-column: 1;
    text-align: left;
    padding: 0;
  }
`;

const Period = styled.div`
  font-size: 12px;
  color: ${colors.ink50};
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  font-family: ${fonts.mono};
`;

const Title = styled.h3`
  font-family: ${fonts.display};
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const TypeBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  color: ${colors.gold};
  border: 1px solid ${colors.goldFaint};
  border-radius: 2px;
  padding: 3px 10px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const Org = styled.div`
  font-size: 14px;
  color: ${colors.ink45};
  margin-bottom: 14px;
`;

const Desc = styled.p`
  font-size: 15px;
  line-height: 1.65;
  color: ${colors.ink70};
  margin: 0 0 14px 0;
`;

const Bullets = styled.ul`
  margin: 0 0 14px 0;
  padding: 0;
  list-style: none;
  color: ${colors.ink70};
  font-size: 15px;
  line-height: 1.65;

  li {
    margin-bottom: 8px;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: ${({ $side }) => ($side === 'left' ? 'flex-end' : 'flex-start')};

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const Tag = styled.span`
  font-size: 11px;
  color: ${colors.ink70};
  background: ${colors.ink04};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 3px 8px;
  font-family: ${fonts.mono};
`;

const JourneyNode = ({ node }) => {
  const [ref, visible] = useRevealOnScroll();

  return (
    <Row ref={ref} $visible={visible}>
      <Dot $current={node.current} />
      <Connector $side={node.side} $visible={visible} />
      <Card $side={node.side}>
        <Period>{node.period}</Period>
        <Title>{node.title}</Title>
        <TypeBadge>{node.type}</TypeBadge>
        <Org>{node.org}</Org>
        {node.desc && <Desc>{node.desc}</Desc>}
        {node.bullets.length > 0 && (
          <Bullets>
            {node.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </Bullets>
        )}
        {node.tags.length > 0 && (
          <Tags $side={node.side}>
            {node.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        )}
      </Card>
    </Row>
  );
};

export default JourneyNode;
