import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../theme';

const Section = styled.section`
  max-width: 760px;
  margin: 0 auto;
  padding: 60px 48px 160px;
  text-align: center;

  @media (max-width: 760px) {
    padding: 60px 20px 100px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin: 0 auto 24px;
`;

const Description = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: ${colors.ink65};
  margin: 0 0 36px 0;
`;

const EmailButton = styled.a`
  display: inline-block;
  background: ${colors.ink};
  color: ${colors.bg};
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 16px 32px;
  border-radius: 2px;
  margin-bottom: 32px;
  font-family: ${fonts.mono};
  transition: background 0.2s ease;

  &:hover {
    background: #3a352e;
  }
`;

const LinksRow = styled.div`
  display: flex;
  gap: 28px;
  justify-content: center;
`;

const SocialLink = styled.a`
  color: ${colors.ink50};
  text-decoration: none;
  font-size: 13px;
  font-family: ${fonts.mono};

  &:hover {
    color: ${colors.ink};
  }
`;

const Contact = () => {
  const { t } = useTranslation();

  return (
    <Section id="contact">
      <Eyebrow>{t('contact.scene')}</Eyebrow>
      <Heading>{t('contact.heading')}</Heading>
      <Rule />
      <Description>{t('contact.description')}</Description>
      <EmailButton href="mailto:amine.mekki.contact@gmail.com">
        amine.mekki.contact@gmail.com
      </EmailButton>
      <LinksRow>
        <SocialLink href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer">GITHUB</SocialLink>
        <SocialLink href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer">LINKEDIN</SocialLink>
      </LinksRow>
    </Section>
  );
};

export default Contact;
