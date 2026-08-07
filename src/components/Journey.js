import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../theme';
import { buildJourneyNodes } from '../utils/journeyNodes';
import { useSectionScrollProgress } from '../hooks/useScrollProgress';
import RiverPath from './RiverPath';
import JourneyNode from './JourneyNode';
import { JourneySkeleton } from './LoadingSkeleton';

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 100px 48px 60px;

  @media (max-width: 760px) {
    padding: 60px 20px;
  }
`;

const Intro = styled.div`
  position: relative;
  z-index: 2;
  max-width: 390px;

  @media (max-width: 760px) {
    max-width: none;
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
  max-width: 600px;
  margin: 0 0 60px 0;
`;

const PathWrap = styled.div`
  position: relative;
`;

const Journey = () => {
  const { t, i18n } = useTranslation();
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathRef = useRef(null);
  const progress = useSectionScrollProgress(pathRef);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const language = i18n.language;
      const [educationRes, experienceRes] = await Promise.all([
        fetch(`/data/education_${language}.json`),
        fetch(`/data/experience_${language}.json`),
      ]);
      setEducation(await educationRes.json());
      setExperience(await experienceRes.json());
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  const nodes = useMemo(() => {
    if (education.length === 0 || experience.length === 0) return [];
    return buildJourneyNodes({
      education,
      experience,
      typeLabels: t('journey.types', { returnObjects: true }),
      educationTitle: t('journey.educationTitle'),
      educationDesc: t('journey.educationDesc'),
    });
  }, [education, experience, t]);

  return (
    <Section id="journey">
      <Intro>
        <Eyebrow>{t('journey.scene')}</Eyebrow>
        <Heading>{t('journey.heading')}</Heading>
        <Rule />
        <Subheading>{t('journey.subheading')}</Subheading>
      </Intro>

      <PathWrap ref={pathRef} id="journey-path-start">
        {loading ? (
          <JourneySkeleton />
        ) : (
          <>
            <RiverPath nodeCount={nodes.length} progress={progress} />
            {nodes.map((node) => (
              <JourneyNode key={node.id} node={node} />
            ))}
          </>
        )}
      </PathWrap>
    </Section>
  );
};

export default Journey;
