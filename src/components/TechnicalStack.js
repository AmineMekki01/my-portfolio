import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  DiPython, DiJavascript1, DiReact, DiDocker, DiAws
} from 'react-icons/di';
import {
  SiPytorch, SiScikitlearn, SiFastapi, SiKubernetes,
  SiPostgresql, SiMongodb, SiRedis, SiApachespark, SiApachekafka, SiMlflow, SiDvc
} from 'react-icons/si';
import techStackData from '../data/techStack.json';

const PineconeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 8H9L12 2Z" fill="#64FFDA"/>
    <path d="M12 22L9 16H15L12 22Z" fill="#64FFDA"/>
    <path d="M2 12L8 9V15L2 12Z" fill="#64FFDA"/>
    <path d="M22 12L16 15V9L22 12Z" fill="#64FFDA"/>
  </svg>
);


const HuggingFaceIcon = styled.div`
  svg {
    width: 30px;
    height: 30px;
    color: #64FFDA;
  }
`;


const iconMap = {
  DiPython: DiPython,
  DiJavascript1: DiJavascript1,
  DiReact: DiReact,
  DiDocker: DiDocker,
  DiAws: DiAws,
  SiPytorch: SiPytorch,
  SiScikitlearn: SiScikitlearn,
  SiFastapi: SiFastapi,
  SiKubernetes: SiKubernetes,
  SiPostgresql: SiPostgresql,
  SiMongodb: SiMongodb,
  SiRedis: SiRedis,
  SiApachespark: SiApachespark,
  SiApachekafka: SiApachekafka,
  PineconeIcon: PineconeIcon,
  SiMlflow: SiMlflow,
  SiDvc: SiDvc,
  HuggingFaceIcon: () => (
    <HuggingFaceIcon>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#64FFDA" strokeWidth="2"/>
        <circle cx="9" cy="10" r="1" fill="#64FFDA"/>
        <circle cx="15" cy="10" r="1" fill="#64FFDA"/>
        <path d="M9 15H15" stroke="#64FFDA" strokeWidth="2"/>
      </svg>
    </HuggingFaceIcon>
  )
};

const TechnicalStack = () => {
  const [techStack, setTechStack] = useState([]);

  useEffect(() => {
    setTechStack(techStackData);
  }, []);

  return (
    <TechnicalStackContainer id="technical-stack">
      <Title>Technical Stack</Title>
      <StackList>
        {techStack.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <StackItem key={index}>
              <IconComponent />
              <StackItemText>{item.name}</StackItemText>
            </StackItem>
          );
        })}
      </StackList>
    </TechnicalStackContainer>
  );
};

const TechnicalStackContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #0a192f;
  color: #ccd6f6;
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
    content: '03.';
    margin-right: 10px;
    color: #f6f7f8;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-size: clamp(16px, 3vw, 20px);
    font-weight: 400;
  }
`;

const StackList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const StackItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  height: 120px;
  background-color: #112240;
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  svg {
    color: #64FFDA;
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;

const StackItemText = styled.div`
  color: #ccd6f6;
  font-size: 1rem;
`;

export default TechnicalStack;
