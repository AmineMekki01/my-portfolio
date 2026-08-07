import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../theme';

const StyledFooter = styled.footer`
  border-top: 1px solid ${colors.ink10};
  padding: 28px 48px;
  text-align: center;
  color: ${colors.ink40};
  font-size: 12px;
  font-family: ${fonts.mono};
`;

const Footer = () => (
  <StyledFooter>
    AMINE_MEKKI · AI ENGINEER · LILLE, FRANCE · {new Date().getFullYear()}
  </StyledFooter>
);

export default Footer;
