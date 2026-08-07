import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { colors } from '../theme';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 24px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    display: none;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 16px;
`;

const Link = styled.a`
  color: ${colors.ink40};
  font-size: 18px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.gold};
  }
`;

const Line = styled.div`
  width: 1px;
  height: 80px;
  background-color: ${colors.ink15};
  margin-top: 16px;
`;

const SocialSidebar = () => (
  <Container>
    <List>
      <li><Link href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /></Link></li>
      <li><Link href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></Link></li>
    </List>
    <Line />
  </Container>
);

export default SocialSidebar;
