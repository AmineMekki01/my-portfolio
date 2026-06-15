import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import LaunchIcon from '@mui/icons-material/Launch';

const HackathonsContainer = styled.div`
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
    content: '03.';
    margin-right: 10px;
    color: #f6f7f8;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-size: clamp(16px, 3vw, 20px);
    font-weight: 400;
  }
`;

const HackathonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 20px;
`;

const HackathonCard = styled.div`
  background-color: rgb(30, 28, 25);
  padding: 1.5rem;
  width: 100%;
  border-radius: 8px;
  text-align: left;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 400px) {
    padding: 0.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HackathonName = styled.h5`
  color: #ccd6f6;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(18px, 5vw, 22px);
`;

const Organizer = styled.p`
  color: #8892b0;
  margin: 0.25rem 0 0 34px;
  font-size: clamp(14px, 3vw, 16px);
`;

const RankingsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const RankingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ isFirst }) => (isFirst ? '#64FFDB' : '#112240')};
  color: ${({ isFirst }) => (isFirst ? '#0a192f' : '#64FFDB')};
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: clamp(12px, 2.5vw, 14px);
  border: ${({ isFirst }) => (isFirst ? 'none' : '1px solid #64FFDB')};
`;

const DetailsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 1rem 0;
  color: #8892b0;
  font-size: clamp(14px, 3vw, 16px);

  svg {
    color: #64FFDB;
    font-size: 1.1rem;
    margin-right: 6px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
`;

const Description = styled.p`
  color: #ccd6f6;
  font-size: clamp(15px, 3vw, 17px);
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: #112240;
  color: #64FFDB;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: clamp(11px, 2.5vw, 13px);
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
`;

const LinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64FFDB;
  text-decoration: none;
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const Hackathons = () => {
  const { i18n } = useTranslation();
  const [hackathonsData, setHackathonsData] = useState([]);

  useEffect(() => {
    const loadHackathonsData = async () => {
      const language = i18n.language;
      const response = await fetch(`/data/hackathons_${language}.json`);
      const data = await response.json();
      setHackathonsData(data);
    };
    loadHackathonsData();
  }, [i18n.language]);

  return (
    <HackathonsContainer id="hackathons">
      <Title>Hackathons & Competitions</Title>
      <HackathonList>
        {hackathonsData.map((item, index) => (
          <HackathonCard key={index}>
            <CardHeader>
              <div>
                <HackathonName>
                  <EmojiEventsIcon style={{ color: '#F6BC00' }} />
                  {item.name}
                </HackathonName>
                <Organizer>{item.organizer}</Organizer>
              </div>
              <RankingsRow>
                {item.rankings.map((ranking, rIndex) => (
                  <RankingBadge key={rIndex} isFirst={ranking.rank === '#1'}>
                    {ranking.rank === '#1' && <EmojiEventsIcon style={{ fontSize: '1rem' }} />}
                    {ranking.rank} {ranking.metric}
                  </RankingBadge>
                ))}
              </RankingsRow>
            </CardHeader>

            <DetailsRow>
              <DetailItem>
                <CalendarTodayIcon />
                {item.date}
              </DetailItem>
              <DetailItem>
                <LocationOnIcon />
                {item.location}
              </DetailItem>
              <DetailItem>
                <GroupIcon />
                {item.team} — {item.username}
              </DetailItem>
            </DetailsRow>

            <Description>{item.description}</Description>

            <Tags>
              {item.tags.map((tag, tIndex) => (
                <Tag key={tIndex}>{tag}</Tag>
              ))}
            </Tags>

            <LinksRow>
              {item.links.map((link, lIndex) => (
                <StyledLink
                  key={lIndex}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LaunchIcon />
                  {link.label}
                </StyledLink>
              ))}
            </LinksRow>
          </HackathonCard>
        ))}
      </HackathonList>
    </HackathonsContainer>
  );
};

export default Hackathons;
