import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useTypewriter } from '../hooks/useTypewriter';
import { colors, fonts } from '../theme';
import HeroWaterfall from './HeroWaterfall';

const fadeUpWord = keyframes`
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px 48px 60px;
  max-width: 1060px;
  margin: 0 auto;
  position: relative;
  isolation: isolate;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 680px;
`;

const IdentityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${colors.ink15};
  position: relative;
  z-index: 1;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.25s ease, box-shadow 0.25s ease, z-index 0.25s;

  &:hover {
    transform: scale(5);
    z-index: 50;
    box-shadow: 0 18px 34px rgba(20, 18, 16, 0.32);
  }
`;

const IdentityText = styled.div`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.ink50};

  strong {
    color: ${colors.ink};
    font-weight: 600;
  }
`;

const Eyebrow = styled.div`
  font-size: 13px;
  letter-spacing: 2px;
  color: ${colors.gold};
  margin-bottom: 20px;
  font-weight: 600;
  font-family: ${fonts.mono};
`;

const Headline = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(2.4rem, 6vw, 4.75rem);
  line-height: 1.08;
  font-weight: 600;
  margin: 0 0 28px 0;
  color: ${colors.ink};
  max-width: 940px;
`;

const Word = styled.span`
  display: inline-block;
  margin-right: 12px;
  animation: ${fadeUpWord} 0.7s ease both;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const Tagline = styled.p`
  font-size: 18px;
  line-height: 1.65;
  color: ${colors.ink65};
  max-width: 640px;
  margin: 0 0 36px 0;
  min-height: 3.2em;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: ${colors.gold};
  margin-left: 3px;
  vertical-align: text-bottom;
  animation: ${blink} 1s step-end infinite;
`;

const CtaRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 36px;
`;

const PrimaryCta = styled.a`
  background: ${colors.ink};
  color: ${colors.bg};
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 2px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: background 0.2s ease;

  &:hover {
    background: #3a352e;
  }
`;

const SecondaryCta = styled.a`
  border: 1px solid ${colors.ink15};
  color: ${colors.ink};
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 2px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${colors.gold};
    color: ${colors.gold};
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const SocialLink = styled.a`
  color: ${colors.ink50};
  font-size: 18px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.gold};
  }
`;

const Hero = () => {
  const { t, i18n } = useTranslation();
  const tagline = useTypewriter(t('hero.tagline'), 12, 900);
  const resumeLink = i18n.language === 'fr' ? '/resume_amine_mekki_fr.pdf' : '/resume_amine_mekki_en.pdf';
  const resumeDownloadName = i18n.language === 'fr' ? 'Amine_MEKKI_Resume_French.pdf' : 'Amine_MEKKI_Resume_English.pdf';
  const words = t('hero.headline').split(' ');

  return (
    <HeroSection id="top">
      <HeroWaterfall />
      <HeroContent>
        <IdentityRow>
          <Avatar src="./images/me_in_grad.jpg" alt={t('hero.name')} />
          <IdentityText>
            <strong>{t('hero.name')}</strong> · {t('heroExtra.location')}
          </IdentityText>
        </IdentityRow>

        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>

        <Headline>
          {words.map((word, i) => (
            <Word key={`${word}-${i}`} $delay={0.15 + i * 0.06}>{word}</Word>
          ))}
        </Headline>

        <Tagline>
          {tagline}
          <Cursor />
        </Tagline>

        <CtaRow>
          <PrimaryCta href="#journey">{t('hero.ctaPrimary')}</PrimaryCta>
          <SecondaryCta href="#contact">{t('hero.ctaSecondary')}</SecondaryCta>
        </CtaRow>

        <SocialRow>
          <SocialLink href="https://linkedin.com/in/mekki-amine" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </SocialLink>
          <SocialLink href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </SocialLink>
          <SocialLink href="mailto:amine.mekki.contact@gmail.com" aria-label="Email">
            <FontAwesomeIcon icon={faEnvelope} />
          </SocialLink>
          <SocialLink href={resumeLink} download={resumeDownloadName} aria-label={t('header.resume')}>
            <FontAwesomeIcon icon={faFileAlt} />
          </SocialLink>
        </SocialRow>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
