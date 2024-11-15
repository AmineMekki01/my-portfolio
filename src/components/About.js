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
          <span>{t('about.description')}
            {' '}
            <a href="https://sanofi.com/" target="_blank" rel="noreferrer">
              {t("about.description_company")}
            </a>
            
            {t("about.description_continue")}</span>

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

  @media (max-width: 900px) {
    flex-direction: column;
     align-items: center;
  }
`;

const Text = styled.div`
  flex: 1;
  font-size: clamp(22px, 5vw, 30px);
  color: #ccd6f6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  p {
    margin: 0 0 20px 0;
    line-height: 1.6;
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

export default About;