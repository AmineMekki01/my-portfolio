import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, rgba(20,18,16,0.05) 25%, rgba(20,18,16,0.1) 50%, rgba(20,18,16,0.05) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const SkeletonCard = styled.div`
  background-color: rgba(20,18,16,0.02);
  border: 1px solid rgba(20,18,16,0.15);
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
  <SkeletonCard style={{ minHeight: '260px' }}>
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

export const JourneySkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
        <SkeletonBase style={{ height: '160px', width: '45%', borderRadius: '8px' }} />
      </div>
    ))}
  </div>
);
