import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #2a2724 25%, #3d3833 50%, #2a2724 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const SkeletonCard = styled.div`
  background-color: rgb(30, 28, 25);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 300px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 24px;
  width: 60%;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: 16px;
  width: ${({ width }) => width || '100%'};
`;

const SkeletonBadge = styled(SkeletonBase)`
  height: 28px;
  width: 80px;
  border-radius: 20px;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const HackathonSkeleton = () => (
  <SkeletonCard>
    <SkeletonTitle />
    <SkeletonRow>
      <SkeletonBadge />
      <SkeletonBadge />
      <SkeletonBadge />
    </SkeletonRow>
    <SkeletonLine width="80%" />
    <SkeletonLine width="60%" />
    <SkeletonLine width="40%" />
  </SkeletonCard>
);

export const ProjectSkeleton = () => (
  <SkeletonCard style={{ minHeight: '300px' }}>
    <SkeletonBase style={{ height: '200px', width: '100%', borderRadius: '8px' }} />
    <SkeletonTitle />
    <SkeletonLine width="90%" />
    <SkeletonLine width="70%" />
    <SkeletonRow>
      <SkeletonBadge />
      <SkeletonBadge />
      <SkeletonBadge />
    </SkeletonRow>
  </SkeletonCard>
);

export const WorkExperienceSkeleton = () => (
  <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
    <SkeletonBase style={{ height: '200px', width: '200px' }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SkeletonTitle />
      <SkeletonLine width="40%" />
      <SkeletonLine width="30%" />
      <SkeletonLine width="100%" />
      <SkeletonLine width="90%" />
      <SkeletonLine width="80%" />
    </div>
  </div>
);

export const EducationSkeleton = () => (
  <SkeletonCard>
    <SkeletonTitle />
    <SkeletonLine width="50%" />
    <SkeletonLine width="40%" />
    <SkeletonLine width="70%" />
  </SkeletonCard>
);
