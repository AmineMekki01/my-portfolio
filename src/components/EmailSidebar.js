import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../theme';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 24px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    display: none;
  }
`;

const EmailText = styled.a`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: ${colors.ink40};
  font-family: ${fonts.mono};
  font-size: 13px;
  text-decoration: none;

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

const EmailSidebar = () => (
  <Container>
    <EmailText href="mailto:amine.mekki.contact@gmail.com">amine.mekki.contact@gmail.com</EmailText>
    <Line />
  </Container>
);

export default EmailSidebar;
