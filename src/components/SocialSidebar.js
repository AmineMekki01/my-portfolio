import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const SocialContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px 10px 0 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SocialItem = styled.li`
  margin: 10px 0;
`;

const SocialLink = styled.a`
  color: #8892b0;
  font-size: 24px;
  transition: color 0.3s;

  &:hover {
    color: #64ffda;
  }
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 90px;
  background-color: #8892b0;
  margin-top: 20px;
`;

const SocialSidebar = () => {
  return (
    <SocialContainer>
      <SocialList>
        <SocialItem>
          <SocialLink href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </SocialLink>
        </SocialItem>
        <SocialItem>
          <SocialLink href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </SocialLink>
        </SocialItem>
  
      </SocialList>
      <VerticalLine />
    </SocialContainer>
  );
};

export default SocialSidebar;
