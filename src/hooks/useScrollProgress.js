import { useEffect, useState } from 'react';
import { computeScrollFraction, computeSectionProgress } from '../utils/scrollMath';

export function useGlobalScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;
    const update = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      setProgress(computeScrollFraction(window.scrollY, scrollHeight, window.innerHeight));
      frame = null;
    };
    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

export function useSectionScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;
    const update = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setProgress(computeSectionProgress(rect.top, rect.height, window.innerHeight));
      }
      frame = null;
    };
    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    const resizeObserver = window.ResizeObserver ? new window.ResizeObserver(requestUpdate) : null;
    if (sectionRef.current) resizeObserver?.observe(sectionRef.current);
    requestUpdate();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      resizeObserver?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [sectionRef]);

  return progress;
}
