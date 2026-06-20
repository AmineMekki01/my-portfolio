import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <AboutContainer id="about">
      <Title>{t('about.title')}</Title>
      <Content>
        <Text>
          <Terminal>
            <TerminalHeader>
              <TerminalDot color="#ff5f56" />
              <TerminalDot color="#ffbd2e" />
              <TerminalDot color="#27c93f" />
              <TerminalTitle>amine@macbook ~ %</TerminalTitle>
            </TerminalHeader>
            <TerminalBody>
              <TerminalLine>
                <Prompt>$</Prompt> <Command>whoami</Command>
              </TerminalLine>
              <TerminalOutput>Amine Mekki — AI Engineer at GENFIT</TerminalOutput>
              <TerminalOutput>Specialties: LLMs, RAG, MLOps, Agentic Systems</TerminalOutput>
              <TerminalOutput>Stack: Python, FastAPI, LangGraph, React, AWS</TerminalOutput>
              <TerminalLine>
                <Prompt>$</Prompt> <Cursor>_</Cursor>
              </TerminalLine>
            </TerminalBody>
          </Terminal>
        </Text>
        <ImageWrapper>
          <Image src="./images/me_in_grad.jpg" alt="Amine MEKKI" />
        </ImageWrapper>
      </Content>
         
          
    </AboutContainer>
  );
};


const AboutContainer = styled.div`
  padding: 2rem;
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 500px) {
    padding: 0;
  }
`;

const Title = styled.h4`
  color: #64FFDB;
  margin-bottom: 2rem;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0 40px;
  width: 100%;
  white-space: nowrap;
  font-weight: 600;
  
  &:before {
    content: '01.';
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

  @media (max-width: 900px) {
    flex-direction: column;
     align-items: center;
  }
`;

const Text = styled.div`
  flex: 1;
  font-size: clamp(18px, 3vw, 22px);
  color: #ccd6f6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;

  > span {
    display: block;
    margin-bottom: 1rem;
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

  @media (max-width: 500px) {
    width: 220px;
    height: 250px;
  }

  @media (max-width: 400px) {
    width: 200px;
    height: 200px;
  }
  
  @media (max-width: 350px) {
    width: 150px;
    height: 150px;
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

const Terminal = styled.div`
  margin-top: 2rem;
  background: #0d1117;
  border-radius: 10px;
  border: 1px solid #30363d;
  overflow: hidden;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
`;

const TerminalDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const TerminalTitle = styled.span`
  margin-left: 8px;
  color: #8b949e;
  font-size: 0.8rem;
`;

const TerminalBody = styled.div`
  padding: 14px 18px;
  color: #c9d1d9;
  line-height: 1.8;
`;

const TerminalLine = styled.div`
  display: flex;
  gap: 8px;
`;

const Prompt = styled.span`
  color: #64ffda;
  font-weight: bold;
`;

const Command = styled.span`
  color: #ff7b72;
`;

const TerminalOutput = styled.div`
  color: #a5d6ff;
  padding-left: 20px;
`;

const Cursor = styled.span`
  color: #64ffda;
  animation: blink 1s step-end infinite;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export default About;