import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar'; 
import EmailSidebar from './components/EmailSidebar';


const MainApp = styled.div`
  background-color: #0A192F;
  color: #ccd6f6;
`;

const Section = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

function App() {
  return (
    <MainApp>
      <CssBaseline />
      <Header />
      <Hero />
      <Container>
        <Section id="about">
          <About />
        </Section>
        <Section id="work-experience">
          <WorkExperience />
        </Section>
        <Section id="projects">
          <Projects />
        </Section>
        <Section id="contact">
          <Contact />
        </Section>
      </Container>
      <SocialSidebar />
      <EmailSidebar />
      <Footer />
    </MainApp>
  );
}

export default App;
