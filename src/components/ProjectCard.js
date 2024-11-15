import React from 'react';
import styled from 'styled-components';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';

const StyledCard = styled.div`
  display: flex;
  min-height: 400px;
  background-color: transparent;
  color: #ccd6f6;
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  position: relative;
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};

  @media (max-width: 1000px) {
    flex-direction: column;
    height: 100%;
    &:hover .project-details {
      opacity: 1;
      transform: translateY(0);
    }

    &:hover .project-title {
      opacity: 0;
    }
  }
`;

const CoverImage = styled.img`
  width: 50%;
  height: 100%;
  filter: brightness(0.7);
  object-fit: cover;
  overflow: hidden;

  &:hover {
    filter: brightness(1);
  }

  @media (max-width: 1000px) {
    width: 100%;
    height: 100%;
  }
`;

const ProjectDetails = styled.div`
  display: flex;
  width: 50%;
  background-color: transparent;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 0 8px 8px 0;

  @media (max-width: 1000px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(10, 25, 47, 0.85);
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
`;

const ProjectTitle = styled.div`
  display: none;

  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(10, 25, 47, 0.85);
    padding: 20px;
  }

  @media (max-width: 500px) {
    margin: 0;
  }
`;

const ProjectDetailsTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ alignLeft }) => (alignLeft ? 'flex-start' : 'flex-end')};
  height: 50px;

  @media (max-width: 1000px) {
    align-items: center;
    margin-bottom: 20px;
  }

  @media (max-width: 500px) {
    margin: 0;
  }
`;

const ProjectDetailsDescription = styled.div`
  display: flex;
  background-color: rgb(30, 28, 25);
  color: black;
  padding: 20px;
  border-radius: 4px;


  @media (max-width: 1000px) {
    background-color: transparent;
    color: #ccd6f6;
  }
  @media (max-width: 700px) {
    padding: 0;
  }
`;

const ProjectStackLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-self: ${({ alignLeft }) => (alignLeft ? 'flex-start' : 'flex-end')};
  @media (max-width: 1000px) {
    align-self: center;
  }
`;

const ProjectDetailsStack = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  color: white;
  margin-left: auto;

  li {
    font-size: 14px;
    margin-right: 15px;
    color: #8892b0;

    @media (max-width: 700px) {
      font-size: 12px;
    }

    @media (max-width: 500px) {
      font-size: 10px;
    }
  }

  @media (max-width: 1000px) {
    justify-content: center;
    margin-left: 0;
  }

  @media (max-width: 500px) {
    margin: 0;
  }
`;

const ProjectLinks = styled.div`
  display: flex;

  margin-left: ${({ alignLeft }) => (alignLeft ? '0' : 'auto')};
  margin-right: ${({ alignLeft }) => (alignLeft ? 'auto' : '0')};

  a {
    color: #ccd6f6;
    margin-right: 10px;
    display: flex;
    align-items: center;

    &:hover {
      color: #64ffda;
    }

    svg {
      font-size: 1.5rem;

      @media (max-width: 500px) {
        font-size: 1rem;
      }
    }
  }

  @media (max-width: 1000px) {
    justify-content: center;
    margin: 0 auto;
  }
`;

const ProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <StyledCard reverse={!isEven}>
      <CoverImage src={project.cover} alt={project.title} className="cover" />
      <ProjectTitle className="project-title">
        <Typography variant="overline" style={{ color: '#ffefd6' }}>
          Personal Project
        </Typography>
        <Typography variant="h5" style={{ marginBottom: '10px' }}>
          {project.title}
        </Typography>
      </ProjectTitle>
      <ProjectDetails className="project-details">
        <ProjectDetailsTitle alignLeft={!isEven}>
          <Typography variant="overline" style={{ color: '#ffefd6' }}>
            Personal Project
          </Typography>
          <Typography variant="h5" style={{ marginBottom: '10px' }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
          </Typography>
        </ProjectDetailsTitle>
        <ProjectDetailsDescription>
          <Typography
            variant="body1"
            fontSize="22px"
            fontSizeMd="16px"
            fontSizeSm="12px"
          >
            {project.description}
          </Typography>
        </ProjectDetailsDescription>
        <ProjectStackLinks  alignLeft={!isEven}>
          <ProjectDetailsStack>
            {project.tech.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ProjectDetailsStack>
          <ProjectLinks alignLeft={!isEven}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </a>
            )}
            {project.external && (
              <a href={project.external} target="_blank" rel="noopener noreferrer">
                <LaunchIcon />
              </a>
            )}
          </ProjectLinks>
        </ProjectStackLinks>
      </ProjectDetails>
    </StyledCard>
  );
};

const Typography = styled.p`
  margin: 0;
  color: ${({ variant }) => (variant === 'overline' ? '#f6f7f8' : '#f6f7f8')};
  font-size: ${({ fontSize, variant }) =>
    fontSize ? fontSize : variant === 'h5' ? '1.5rem' : variant === 'body1' ? '1rem' : '0.875rem'};
  text-transform: ${({ variant }) => (variant === 'overline' ? 'uppercase' : 'none')};
  font-weight: ${({ variant }) => (variant === 'h5' ? '600' : '400')};

  a {
    text-decoration: none;
    color: #f6f7f8;
  }

  @media (max-width: 1000px) {
    font-size: ${({ fontSizeMd, fontSize, variant }) =>
      fontSizeMd ? fontSizeMd : fontSize ? fontSize : variant === 'h5' ? '1.2rem' : variant === 'body1' ? '0.9rem' : '0.75rem'};
  }

  @media (max-width: 600px) {
    font-size: ${({ fontSizeSm, fontSize, variant }) =>
      fontSizeSm ? fontSizeSm : fontSize ? fontSize : variant === 'h5' ? '1rem' : variant === 'body1' ? '0.875rem' : '0.75rem'};
  }
`;


export default ProjectCard;
