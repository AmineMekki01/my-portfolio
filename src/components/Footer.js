import React from 'react';
import { Typography, Box } from '@mui/material';
import styled from 'styled-components';

const StyledFooter = styled(Box)`
  background-color: #0a192f;
  color: #ccd6f6;
  padding: 1rem;
  text-align: center;
  margin-top: 2rem;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Typography variant="body2">&copy; {new Date().getFullYear()} Amine MEKKI . Feel Free to use the template.</Typography>
    </StyledFooter>
  );
};

export default Footer;
