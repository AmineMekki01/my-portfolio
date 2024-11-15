import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Box, IconButton, Drawer, List, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  transition: background-color 0.3s ease-in-out;
  background-color: ${({ opacity }) => `rgba(15, 10, 5, ${opacity})`};
  display: flex;
  align-items: center;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 60px;

  @media (max-width: 800px) {
    height: 50px;
  }
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  display: flex;
  gap: 1rem;

  @media (max-width: 800px) {
    display: none;
  }
`;

const StyledButton = styled.a`
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  padding: 0 12px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    border-bottom: 2px solid white;
  }
`;


const LanguageContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const MobileMenuButton = styled(IconButton)`
  color: #64FFDB !important;
  font-size: 80px;
`;

const CustomDrawer = styled(Drawer)`
  .MuiPaper-root {
    background-color: rgb(15, 10, 5) !important;
    width: 250px !important;
    height: 100% !important;
  }
`;

const CustomListItemText = styled(ListItemText)`
  .MuiTypography-root {
    color: white !important;
  }
`;

const CustomListItem = styled.div`
  padding: 16px;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  color: #0a192f;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: rgba(100, 255, 218, 0.1);
  }
`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const [opacity, setOpacity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const newOpacity = scrollTop > 50 ? 0.9 : 1;
    setOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuItemClick = (href) => {
    setDrawerOpen(false);
    setTimeout(() => {
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const menuItems = [
    { text: t('header.about'), href: '#about' },
    { text: t('header.workExperience'), href: '#work-experience' },
    { text: t('header.projects'), href: '#projects' },
    { text: t('header.education'), href: '#education' },
    { text: t('header.contact'), href: '#contact' },
    { text: t('header.technicalStack'), href: '#technical-stack'},

  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <HeaderContainer opacity={opacity}>
      <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
        <StyledToolbar>
          <StyledBox>
            {menuItems.slice(0, -1).map((item, index) => (
              <StyledButton key={index} href={item.href}>{item.text}</StyledButton>
            ))}
          </StyledBox>
          <LanguageContainer>
            <StyledButton onClick={() => changeLanguage('en')}>EN</StyledButton>
            <StyledButton onClick={() => changeLanguage('fr')}>FR</StyledButton>
          </LanguageContainer>
          {isSmallScreen && (
            <MobileMenuButton edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </MobileMenuButton>
          )}
        </StyledToolbar>
      </AppBar>
      <CustomDrawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '80%', sm: '250px' },
            height: { xs: '100%', sm: '100%' },
          },
        }}
      >
        <List>
          {menuItems.slice(0, -1).map((item, index) => (
            <CustomListItem key={index} onClick={() => handleMenuItemClick(item.href)}>
              <CustomListItemText primary={item.text} />
            </CustomListItem>
          ))}

        </List>
      </CustomDrawer>
    </HeaderContainer>
  );
};

export default Header;
