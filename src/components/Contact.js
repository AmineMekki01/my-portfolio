import React from 'react';
import styled from 'styled-components';

const ContactSection = styled.section`
  text-align: center;
  padding: 100px 0;
  max-width: 600px;
  margin: 0 auto;
`;

const ContactTitle = styled.h4`
  color: #64ffda;
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 400;
  margin-bottom: 20px;
  &:before {
    content: '05. ';
    color: #64ffda;
  }
`;

const MainTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3rem);
  margin-bottom: 20px;
`;

const ContactDescription = styled.p`
  font-size: 1.2rem;
  color: #8892b0;
  margin-bottom: 40px;
`;

const ContactButton = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: #64ffda;
  border: 1px solid #64ffda;
  border-radius: 5px;
  text-decoration: none;
  transition: background 0.3s ease-in-out;
  
  &:hover {
    background: rgba(100, 255, 218, 0.1);
  }
`;

const Contact = () => {
  return (
    <ContactSection id="contact">
      <ContactTitle>Get In Touch</ContactTitle>
      <MainTitle>Hi There!</MainTitle>
      <ContactDescription>
        I’m currently looking for a Data Scientist or Machine Learning role. My inbox is always open. Whether you are interested in my profile, have a question or just want to say hi. Feel Free to reach out.
      </ContactDescription>
      <ContactButton href="mailto:amine.mekki.contact@gmail.com">
        Contact Me
      </ContactButton>
    </ContactSection>
  );
};

export default Contact;
