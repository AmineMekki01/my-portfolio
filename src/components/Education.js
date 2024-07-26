import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SchoolIcon from '@mui/icons-material/School';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import educationData from '../data/education.json';

const EducationContainer = styled.div`
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
    content: '04.';
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
  background-color: #112240;
  padding: 1.5rem;
  width: 100%;
  border-radius: 8px;
  text-align: left;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const EducationTitle = styled.h3`
  color: #64FFDB;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EducationDetails = styled.div`
  color: #8892b0;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;



const Education = () => {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    setEducation(educationData);
  }, []);

  return (
    <EducationContainer id="education">
      <Title>Education</Title>
      <EducationList>
        {education.map((item, index) => (
          <EducationItem key={index}>
            <EducationTitle>
                <ClassIcon />
              {item.degree}
            </EducationTitle>
            <EducationDetails>
              <SchoolIcon />
              {item.institution}
            </EducationDetails>
            <EducationDetails>
              <DateRangeIcon />
              {item.range}
            </EducationDetails>
            <EducationDetails>
              <MenuBookIcon />
              Courses: {item.courses}
      
            </EducationDetails>
            
          </EducationItem>
        ))}
      </EducationList>
    </EducationContainer>
  );
};

export default Education;
