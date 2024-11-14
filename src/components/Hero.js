import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EngineeringIcon from '@mui/icons-material/Engineering';

const TechList = styled.div`
  ul {
    display: flex;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-size: 1.5rem;
      color: #8892b0;
    }
  }
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #0a192f;
@media (max-width: 900px) {
    flex-direction: column-reverse;
  }
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
  h4 {
    color: #8892b0;
    font-size: 20px;
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

const MainHero = styled.div`
  display: flex;
  flex-direction: column;

`;

const ImageWrapper = styled.div`
  width: 300px;
  height: 300px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #64ffda;
  margin-left: 40px;

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


const Hero = () => {
  const { t } = useTranslation();

  return (
    <HeroSection>
      <MainHero>
        <h1>{t('hero.intro')}</h1>
        <h2>{t('hero.name')}</h2>
        <TechList>
          <ul>
            <li><EngineeringIcon style={{ verticalAlign: 'middle', marginRight: '8px', color: '#64ffda' }} />{t('heroExtra.jobTitle')}</li>
            <li><WorkOutlineIcon style={{ verticalAlign: 'middle', marginRight: '8px', color: '#64ffda' }} />{t('heroExtra.exp')}</li>
            <li><LocationOnIcon style={{ verticalAlign: 'middle', marginRight: '8px', color: '#64ffda' }} />{t('heroExtra.location')}</li>
          </ul>
        </TechList>
        <p>{t('hero.tagline')}</p>
        <a href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer">
          {t('hero.linkedinButton')}
        </a>
      </MainHero>
      
      <ImageWrapper>
        <Image src="./images/me_in_grad.jpg" alt="Brittany Chiang" />
      </ImageWrapper>
    </HeroSection>
  );
};

export default Hero;
