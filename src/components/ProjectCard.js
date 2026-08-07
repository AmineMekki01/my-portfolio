import React from 'react';
import styled from 'styled-components';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { colors, fonts } from '../theme';

const Card = styled.div`
  position: relative;
  background: ${colors.ink02};
  border: 1px solid ${colors.ink15};
  border-radius: 4px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(28px)')};
  transition: opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(156, 122, 63, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 16px;
    height: 16px;
    border-top: 1px solid ${colors.gold};
    border-left: 1px solid ${colors.gold};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 16px;
    height: 16px;
    border-bottom: 1px solid ${colors.gold};
    border-right: 1px solid ${colors.gold};
  }
`;

const Title = styled.h3`
  font-family: ${fonts.display};
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: ${colors.ink};
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.ink70};
  margin: 0 0 18px 0;
  flex: 1;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 18px;
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

const Links = styled.div`
  display: flex;
  gap: 16px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: ${colors.ink50};
    text-decoration: none;
    font-size: 13px;
    font-family: ${fonts.mono};

    &:hover {
      color: ${colors.gold};
    }
  }
`;

const ProjectCard = ({ project }) => {
  const [ref, visible] = useRevealOnScroll();

  return (
    <Card ref={ref} $visible={visible}>
      <Title>{project.title}</Title>
      <Description>{project.description}</Description>
      <Tags>
        {project.tech.map((tech) => <Tag key={tech}>{tech}</Tag>)}
      </Tags>
      <Links>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon style={{ fontSize: 16 }} /> GitHub
          </a>
        )}
        {project.external && project.external !== project.github && (
          <a href={project.external} target="_blank" rel="noopener noreferrer">
            <LaunchIcon style={{ fontSize: 16 }} /> Live
          </a>
        )}
      </Links>
    </Card>
  );
};

export default ProjectCard;
