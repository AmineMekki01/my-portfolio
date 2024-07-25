import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
  transition: background-color 0.3s ease-in-out;
  background-color: ${({ opacity }) => `rgba(10, 25, 47, ${opacity})`};
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  height: 100px;
`;

const StyledBox = styled(Box)`
  display: flex;
  gap: 1rem;
  height: 100%;
`;

const Logo = styled.img`
  height: 90px;
  margin: 5px 0; 
`;

const StyledButton = styled.a`
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease-in-out;
  
  &:hover {
    background-color: rgba(100, 255, 218, 0.1);
  }
`;

const ResumeButton = styled(StyledButton)`
  color: #64FFDB;
  padding: 8px 16px;

  &:hover {
    background-color: rgba(100, 255, 218, 0.1);
  }
`;

const Header = () => {
  const [opacity, setOpacity] = useState(1);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const newOpacity = scrollTop > 50 ? 0.9 : 1;
    setOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <HeaderContainer opacity={opacity}>
      <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
        <StyledToolbar>
          <Logo src="/images/MyLogo.svg" alt="Logo" />
          <StyledBox>
            <StyledButton href="#about">About</StyledButton>
            <StyledButton href="#work-experience">Work Experience</StyledButton>
            <StyledButton href="#projects">Projects</StyledButton>
            <StyledButton href="#contact">Contact</StyledButton>
            <ResumeButton href="/resume_amine_mekki.pdf" download="Amine_MEKKI_Resume.pdf">Resume</ResumeButton>
          </StyledBox>
        </StyledToolbar>
      </AppBar>
    </HeaderContainer>
  );
};

export default Header;
