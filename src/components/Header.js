import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, List, useMediaQuery } from '@mui/material';
import styled from 'styled-components';
import { colors, fonts } from '../theme';

const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid ${colors.ink10};
  background: rgba(245, 239, 226, ${({ $scrolled }) => ($scrolled ? 0.92 : 0.75)});
  backdrop-filter: blur(10px);
  transition: background 0.3s ease;

  @media (max-width: 700px) {
    padding: 16px 20px;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${colors.ink};
  text-decoration: none;
  letter-spacing: 1px;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${colors.gold};
  display: inline-block;
  animation: recPulse 1.6s ease-in-out infinite;

  @keyframes recPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.85); }
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 26px;
  align-items: center;

  @media (max-width: 860px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${colors.ink65};
  text-decoration: none;
  font-size: 13px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.ink};
  }
`;

const LangButton = styled.button`
  background: none;
  border: 1px solid ${({ $active }) => ($active ? colors.gold : colors.ink15)};
  color: ${({ $active }) => ($active ? colors.ink : colors.ink50)};
  font-family: ${fonts.mono};
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 2px;
  cursor: pointer;
`;

const ConnectLink = styled.a`
  color: ${colors.bg};
  background: ${colors.ink};
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 2px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: background 0.2s ease;

  &:hover {
    background: #3a352e;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: 1px solid ${colors.ink15};
  color: ${colors.ink};
  border-radius: 2px;
  padding: 8px 12px;
  font-size: 12px;
  font-family: ${fonts.mono};
  cursor: pointer;

  @media (max-width: 860px) {
    display: block;
  }
`;

const CustomDrawer = styled(Drawer)`
  .MuiPaper-root {
    background-color: ${colors.bg} !important;
    width: 100% !important;
    padding: 40px;
  }
`;

const MobileLink = styled.a`
  display: block;
  color: ${colors.ink};
  text-decoration: none;
  font-size: 24px;
  font-family: ${fonts.display};
  margin-bottom: 28px;
  cursor: pointer;
`;

const LangRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const NAV_ITEMS = [
  { key: 'journey', href: '#journey' },
  { key: 'quests', href: '#quests' },
  { key: 'stack', href: '#stack' },
  { key: 'work', href: '#work' },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 860px)');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const closeAndScroll = (href) => {
    setDrawerOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return (
    <HeaderBar $scrolled={scrolled}>
      <Logo href="#top">
        <Dot />
        A_MEKKI
      </Logo>

      <DesktopNav>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.key} href={item.href}>
            {t(`header.${item.key}`)}
          </NavLink>
        ))}
        <LangButton $active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>EN</LangButton>
        <LangButton $active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}>FR</LangButton>
        <ConnectLink href="#contact">{t('header.connect')}</ConnectLink>
      </DesktopNav>

      {isSmallScreen && (
        <MobileMenuButton onClick={() => setDrawerOpen(true)} aria-label={t('header.menu')}>
          {t('header.menu')}
        </MobileMenuButton>
      )}

      <CustomDrawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {NAV_ITEMS.map((item) => (
            <MobileLink key={item.key} onClick={() => closeAndScroll(item.href)}>
              {t(`header.${item.key}`)}
            </MobileLink>
          ))}
          <MobileLink onClick={() => closeAndScroll('#contact')} style={{ color: colors.gold }}>
            {t('header.connect')}
          </MobileLink>
        </List>
        <LangRow>
          <LangButton $active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>EN</LangButton>
          <LangButton $active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}>FR</LangButton>
        </LangRow>
      </CustomDrawer>
    </HeaderBar>
  );
};

export default Header;
