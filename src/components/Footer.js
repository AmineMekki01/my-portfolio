import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const StyledFooter = styled.footer`
  background-color: rgb(15, 10, 5);
  color: #8892b0;
  padding: 2rem 1rem;
  text-align: center;
  margin-top: 2rem;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: 0.875rem;
`;

const FooterNav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  a {
    color: #ccd6f6;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #64ffda;
    }
  }
`;

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  a {
    color: #8892b0;
    font-size: 1.25rem;
    transition: color 0.3s, transform 0.3s;

    &:hover {
      color: #64ffda;
      transform: translateY(-2px);
    }
  }
`;

const Copyright = styled.p`
  margin: 0;
  line-height: 1.6;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <FooterNav>
        <a href="#about">About</a>
        <a href="#work-experience">Experience</a>
        <a href="#hackathons">Hackathons</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </FooterNav>
      <SocialRow>
        <a href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </SocialRow>
      <Copyright>
        &copy; {new Date().getFullYear()} Amine MEKKI. Built with React.
      </Copyright>
    </StyledFooter>
  );
};

export default Footer;
