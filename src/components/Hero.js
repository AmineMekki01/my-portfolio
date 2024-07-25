import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #0a192f;

  h1 {
    color: #64ffda;
    font-size: clamp(16px, 5vw, 24px);
    margin: 0;
  }

  h2 {
    color: #ccd6f6;
    font-size: clamp(40px, 8vw, 80px);
    margin: 10px 0;
  }

  h3 {
    color: #8892b0;
    font-size: clamp(20px, 5vw, 36px);
    margin: 0;
  }

  p {
    color: #8892b0;
    font-size: 20px;
    max-width: 600px;

    margin: 20px auto 0;

    @media (max-width: 600px) {
        margin: 20px 20px;
    }
  }

  a {
    margin-top: 50px;
    padding: 15px 30px;
    font-size: 18px;
    color: #64ffda;
    background-color: transparent;
    border: 1px solid #64ffda;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: rgba(100, 255, 218, 0.1);
    }
  }
`;

const Hero = () => (
  <HeroSection>
    <h1>Hi, my name is</h1>
    <h2>Amine MEKKI</h2>
    <h3>I build intelligent systems.</h3>
    <p>I’m a data scientist and machine learning engineer specializing in creating exceptional predictive models and data-driven solutions. Currently, I’m focused on developing scalable, human-centered applications in the field of artificial intelligence and Generative AI.</p>
    <a href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer">
      Check out my LinkedIn
    </a>
  </HeroSection>
);

export default Hero;