import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import { ProjectSkeleton } from './LoadingSkeleton';
import { colors, fonts } from '../theme';

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 48px 120px;

  @media (max-width: 760px) {
    padding: 60px 20px 80px;
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
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch(`/data/projects_${i18n.language}.json`);
      setProjects(await response.json());
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  return (
    <Section id="work">
      <Eyebrow>{t('work.scene')}</Eyebrow>
      <Heading>{t('work.heading')}</Heading>
      <Rule />
      {loading ? (
        <Grid>
          {[...Array(3)].map((_, i) => <ProjectSkeleton key={i} />)}
        </Grid>
      ) : (
        <Grid>
          {projects.map((project, i) => <ProjectCard key={i} project={project} />)}
        </Grid>
      )}
    </Section>
  );
};

export default Projects;
