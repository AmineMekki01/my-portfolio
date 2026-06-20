import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import SchoolIcon from '@mui/icons-material/School';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import { EducationSkeleton } from './LoadingSkeleton';

const EducationContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #ccd6f6;
  @media (max-width: 400px) {
    padding: 0;
  }
`;

const Title = styled.h4`
  color: #64FFDB;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0 40px;
  width: 100%;
  white-space: nowrap;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 600;

  &:before {
    content: '06.';
    margin-right: 10px;
    color: #f6f7f8;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-size: clamp(16px, 3vw, 20px);
    font-weight: 400;
  }
`;

const EducationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 20px;
`;

const EducationItem = styled.div`
  background-color: rgb(30, 28, 25);
  padding: 1.5rem;
  width: 100%;
  border-radius: 8px;
  text-align: left;
  transition: transform 0.25s ease, border-color 0.25s ease;
  border: 1px solid transparent;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(100, 255, 218, 0.25);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  @media (max-width: 400px) {
    padding: 0.5rem;
  }
`;

const SchoolLogo = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  flex-shrink: 0;
  filter: brightness(0.9);
  transition: filter 0.3s ease;

  ${EducationItem}:hover & {
    filter: brightness(1);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

const SchoolInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EducationTitle = styled.h5`
  color: #ccd6f6;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(18px, 5vw, 22px);

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const EducationDetails = styled.div`
  color: #8892b0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(14px, 3vw, 17px);

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const Education = () => {
  const { i18n } = useTranslation();
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEducationData = async () => {
      setLoading(true);
      const language = i18n.language;
      const response = await fetch(`/data/education_${language}.json`);
      const data = await response.json();
      setEducationData(data);
      setLoading(false);
    };
    loadEducationData();
  }, [i18n.language]);

  return (
    <EducationContainer id="education">
      <Title>Education</Title>
      {loading ? (
        <EducationList>
          {[...Array(2)].map((_, i) => (
            <EducationSkeleton key={i} />
          ))}
        </EducationList>
      ) : (
        <EducationList>
          {educationData.map((item, index) => (
            <EducationItem key={index}>
              <SchoolLogo src={item.logo} alt={`${item.institution} logo`} />
              <SchoolInfo>
                <EducationTitle><ClassIcon />{item.degree}</EducationTitle>
                <EducationDetails><SchoolIcon />{item.institution}</EducationDetails>
                <EducationDetails><DateRangeIcon />{item.range}</EducationDetails>
                <EducationDetails><MenuBookIcon />{item.courses}</EducationDetails>
              </SchoolInfo>
            </EducationItem>
          ))}
        </EducationList>
      )}
    </EducationContainer>
  );
};

export default Education;
