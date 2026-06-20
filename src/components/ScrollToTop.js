import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Button = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #64ffda;
  color: #0a192f;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);

  &:hover {
    transform: ${({ visible }) => (visible ? 'translateY(-4px)' : 'translateY(20px)')};
    box-shadow: 0 6px 20px rgba(100, 255, 218, 0.5);
  }

  svg {
    font-size: 1.5rem;
  }

  @media (max-width: 600px) {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button visible={visible} onClick={scrollToTop} aria-label="Scroll to top">
      <KeyboardArrowUpIcon />
    </Button>
  );
};

export default ScrollToTop;
