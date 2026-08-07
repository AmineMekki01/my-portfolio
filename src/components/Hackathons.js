import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import LaunchIcon from '@mui/icons-material/Launch';
import { HackathonSkeleton } from './LoadingSkeleton';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { colors, fonts } from '../theme';

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 48px;

  @media (max-width: 760px) {
    padding: 60px 20px;
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
  margin-bottom: 24px;
`;

const Subheading = styled.p`
  font-size: 16px;
  color: ${colors.ink55};
  max-width: 640px;
  margin: 0 0 48px 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  position: relative;
  background: ${colors.ink02};
  border: 1px solid ${colors.ink15};
  border-radius: 4px;
  padding: 36px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(28px)')};
  transition: opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(156, 122, 63, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 18px;
    height: 18px;
    border-top: 1px solid ${colors.gold};
    border-left: 1px solid ${colors.gold};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 18px;
    height: 18px;
    border-bottom: 1px solid ${colors.gold};
    border-right: 1px solid ${colors.gold};
  }

  @media (max-width: 600px) {
    padding: 22px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 6px;
`;

const Name = styled.h3`
  font-family: ${fonts.display};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: ${colors.ink};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Badges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.goldDark};
  background: ${colors.goldSoft};
  border-radius: 2px;
  padding: 5px 10px;
  white-space: nowrap;
  font-family: ${fonts.mono};
`;

const Organizer = styled.div`
  color: ${colors.ink40};
  font-size: 14px;
  margin-bottom: 16px;
`;

const Details = styled.div`
  display: flex;
  gap: 20px;
  color: ${colors.ink40};
  font-size: 13px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  font-family: ${fonts.mono};

  svg {
    font-size: 14px;
    margin-right: 4px;
    vertical-align: -2px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${colors.ink70};
  margin: 0 0 20px 0;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  font-size: 12px;
  color: ${colors.ink70};
  background: ${colors.ink04};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 4px 10px;
  font-family: ${fonts.mono};
`;

const Links = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const LinkItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${colors.goldDark};
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  font-family: ${fonts.mono};

  &:hover {
    color: ${colors.ink};
  }

  svg {
    font-size: 15px;
  }
`;

const QuestCard = ({ item }) => {
  const [ref, visible] = useRevealOnScroll();

  return (
    <Card ref={ref} $visible={visible}>
      <CardHeader>
        <Name><EmojiEventsIcon style={{ color: colors.gold, fontSize: 22 }} />{item.name}</Name>
        <Badges>
          {item.rankings.map((ranking, i) => (
            <Badge key={i}>{ranking.rank} {ranking.metric}</Badge>
          ))}
        </Badges>
      </CardHeader>
      <Organizer>{item.organizer}</Organizer>
      <Details>
        <span><CalendarTodayIcon />{item.date}</span>
        <span><LocationOnIcon />{item.location}</span>
        <span><GroupIcon />{item.team} — {item.username}</span>
      </Details>
      <Description>{item.description}</Description>
      <Tags>
        {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </Tags>
      <Links>
        {item.links.map((link, i) => (
          <LinkItem key={i} href={link.url} target="_blank" rel="noopener noreferrer">
            <LaunchIcon />{link.label}
          </LinkItem>
        ))}
      </Links>
    </Card>
  );
};

const Hackathons = () => {
  const { t, i18n } = useTranslation();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch(`/data/hackathons_${i18n.language}.json`);
      setHackathons(await response.json());
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  return (
    <Section id="quests">
      <Eyebrow>{t('quests.scene')}</Eyebrow>
      <Heading>{t('quests.heading')}</Heading>
      <Rule />
      <Subheading>{t('quests.subheading')}</Subheading>
      {loading ? (
        <List><HackathonSkeleton /></List>
      ) : (
        <List>
          {hackathons.map((item, i) => <QuestCard key={i} item={item} />)}
        </List>
      )}
    </Section>
  );
};

export default Hackathons;
