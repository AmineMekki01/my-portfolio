import React from 'react';
import styled from 'styled-components';

const About = () => {
  return (
    <AboutContainer id="about">
      <Title>About Me</Title>
      <Content>
        <Text>
          <span>I’m a Machine learning engineer specializing in solving and building exceptional data science/Machine learning Projects. Currently, I’m focused on  improving 
          {' '}
          <a href="https://sanofi.com/" target="_blank" rel="noreferrer">
            Sanofi's
          </a>{' '}
          Supply chain. using Data Science and Generative AI</span>
          <p>Here are a few technologies I’ve been working with recently:</p>
          <TechList>
            <ul>
              <li>Python</li>
              <li>Pytorch</li>
              <li>AWS</li>
              <li>JavaScript</li>
              <li>React</li>
              <li>Go</li>
            </ul>
          </TechList>
        </Text>
        <ImageWrapper>
          <Image src="./images/me_in_grad.jpg" alt="Brittany Chiang" />
        </ImageWrapper>
      </Content>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  padding: 2rem;
  text-align: left;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h4`
  color: #64FFDB;
  margin-bottom: 2rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0 40px;
  width: 100%;
  white-space: nowrap;
  font-size: clamp(18px, 5vw, 32px);
  font-weight: 600;
  

  &:before {
    counter-increment: section;
    content: '0' counter(section) '.';
    margin-right: 10px;
    color: #f6f7f8;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-size: clamp(16px, 3vw, 20px);
    font-weight: 400;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
     align-items: center;
  }
`;

const Text = styled.div`
  flex: 1;
  color: #ccd6f6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  p {
    margin: 0 0 20px 0;
    line-height: 1.6;
    
  }
  
 
`;

const TechList = styled.div`
  ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-size: 0.9rem;
      color: #8892b0;

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: #64ffda;
        font-size: 0.8rem;
        line-height: 12px;
      }
    }
  }
`;

const ImageWrapper = styled.div`
  width: 300px;
  height: 300px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #64ffda;

  @media (max-width: 768px) {
    margin: 0 auto;
  }

  @media (max-width: 400px) {
    width: 220px;
    height: 250px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  filter: brightness(0.6);

  &:hover {
    transform: scale(1.1);
    filter: brightness(1);
  }
`;

export default About;
