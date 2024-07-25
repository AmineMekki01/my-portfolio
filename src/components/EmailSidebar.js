import React from 'react';
import styled from 'styled-components';

const EmailContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 10px 10px 0 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmailText = styled.a`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: #8892b0;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: 14px;
  text-decoration: none;
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

const EmailSidebar = () => {
  return (
    <EmailContainer>
      <EmailText href="mailto:amine.mekki.contact@gmail.com">amine.mekki.contact@gmail.com</EmailText>
      <VerticalLine />
    </EmailContainer>
  );
};

export default EmailSidebar;
