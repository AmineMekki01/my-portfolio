import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: #0a192f;
  color: #ccd6f6;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #64ffda;
`;

const ExperienceBubble = styled.div`
  position: absolute;
  top: -10px;
  left: -110px;
  background: transparent;
  color: #ccd6f6;
  padding: 5px 10px;
  border: 2px solid #ccd6f6;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Name = styled.h3`
  color: #ccd6f6;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const Location = styled.span`
  font-size: 1rem;
  color: #ccd6f6;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FlagIcon = styled.img`
  width: 20px;
  height: 15px;
  object-fit: cover;
`;

const Title = styled.h1`
  font-size: clamp(3rem, 8vw, 6rem);
  color: #ccd6f6;
  margin: 10px 0;
  line-height: 1.1;
  font-weight: bold;
`;


const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  color: #ccd6f6;
  font-size: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #64ffda;
  }
`;

const ContactButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  margin-left: 40px;
  height: 50px;
  font-size: 1rem;
  color: #ccd6f6;
  border: 1px solid #ccd6f6;
  border-radius: 30px;
  text-decoration: none;
  background-color: transparent;
  font-weight: 600;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: rgba(100, 255, 218, 0.1);
  }
`;

const TitleContactContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const TitleContact = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 100px;
`;

const Hero = () => {
  const { t, i18n } = useTranslation();
  const resumeLink = i18n.language === 'fr' ? '/resume_amine_mekki_fr.pdf' : '/resume_amine_mekki_en.pdf';
  const resumeDownloadName = i18n.language === 'fr' ? 'Amine_MEKKI_Resume_French.pdf' : 'Amine_MEKKI_Resume_English.pdf';

  return (
    <HeroSection>
      <ProfileContainer>
        <ProfileImage src="./images/me_in_grad.jpg" alt="Profile" />
        <ExperienceBubble>
          <WorkOutlineIcon  style={{ verticalAlign: 'middle', marginRight: '8px', color: '#64ffda' }} />{t('heroExtra.exp')}
        </ExperienceBubble>
        <NameContainer>
          <Name>{t("hero.name")}</Name>
          <Location>
            <FlagIcon src="/images/france-flag.png" alt="France Flag" />
            {t("heroExtra.location")}
          </Location>
        </NameContainer>
      </ProfileContainer>

      <TitleContactContainer>
        <Title>{t('heroExtra.jobTitle1')}</Title>

        <TitleContact>
          <Title>{t('heroExtra.jobTitle2')}</Title>

          <ContactButton href="mailto:amine.mekki.contact@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
            {t('heroExtra.contactMe')}
          </ContactButton>
        </TitleContact>
      </TitleContactContainer>

      <SocialContainer>
        <SocialIcon href="https://linkedin.com/in/mekki-amine" target="_blank" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} />
        </SocialIcon>
        <SocialIcon href="https://github.com/AmineMekki01" target="_blank" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} />
        </SocialIcon>
        <SocialIcon 
          href={resumeLink} 
          download={resumeDownloadName} 
          aria-label={t('header.resume')}
        >
          <FontAwesomeIcon icon={faFileAlt} />
        </SocialIcon>
      </SocialContainer>
    </HeroSection>
  );
};

export default Hero;