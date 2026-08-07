import React from 'react';
import { CssBaseline } from '@mui/material';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import Journey from './components/Journey';
import Hackathons from './components/Hackathons';
import TechnicalStack from './components/TechnicalStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import EmailSidebar from './components/EmailSidebar';
import ScrollToTop from './components/ScrollToTop';
import { colors } from './theme';
import { useGlobalScrollProgress } from './hooks/useScrollProgress';

const Page = styled.div`
  background-color: ${colors.bg};
  color: ${colors.ink};
  min-height: 100vh;
  position: relative;
`;

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: ${colors.gold};
  z-index: 100;
  width: ${({ $progress }) => $progress * 100}%;
  transition: width 0.1s linear;
`;

function App() {
  const progress = useGlobalScrollProgress();

  return (
    <Page>
      <CssBaseline />
      <ProgressBar $progress={progress} />
      <Header />
      <Hero />
      <MarqueeTicker />
      <Journey />
      <Hackathons />
      <TechnicalStack />
      <Projects />
      <Contact />
      <SocialSidebar />
      <EmailSidebar />
      <ScrollToTop />
      <Footer />
    </Page>
  );
}

export default App;
