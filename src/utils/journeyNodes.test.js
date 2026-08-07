import { buildJourneyNodes } from './journeyNodes';

const education = [
  { degree: 'Engineering Degree', institution: 'IMT MINES ALES', range: 'August 2021 - August 2024', courses: 'Machine Learning, Deep Learning' },
  { degree: 'MSc Biomedical Engineering', institution: 'University of Montpellier', range: 'August 2021 - August 2024', courses: 'Medical Imaging, Signal Processing' },
];

const experience = [
  { company: 'GENFIT', title: 'AI ENGINEER', range: 'December 2024 - Present', location: 'Lille, France', description: ['Did A.', 'Did B.', 'Tech Stack : Python, FastAPI.'] },
  { company: 'Sanofi', title: 'AI ENGINEER', range: 'September 2023 - August 2024', location: 'Lyon, France', description: ['Did C.', 'Tech Stack : Python, LangGraph.'] },
  { company: 'Ecole des Mines Alès', title: 'MLOps Engineer - intern', range: 'January - March 2024', location: 'Alès, France', description: ['Did D.', 'Tech Stack : AWS.'] },
  { company: 'Vaisala', title: 'Data Scientist - intern', range: 'April - August 2023', location: 'Saclay, France', description: ['Did E.', 'Tech Stack : Python.'] },
  { company: 'EuroMov Digital Health in Motion', title: 'Machine Learning Engineer - Intern', range: 'January - April 2023', location: 'Montpellier, France', description: ['Did F.', 'Tech Stack : PyTorch.'] },
];

const typeLabels = {
  education: 'EDUCATION',
  genfit: 'AI ENGINEERING',
  sanofi: 'AI ENGINEERING',
  'ecole-des-mines-ales': 'MLOPS',
  vaisala: 'DATA SCIENCE',
  'euromov-digital-health-in-motion': 'RESEARCH',
};

describe('buildJourneyNodes', () => {
  const nodes = buildJourneyNodes({
    education,
    experience,
    typeLabels,
    educationTitle: 'Dual degree',
    educationDesc: 'Two programs at once.',
  });

  test('orders education first, then experience chronologically', () => {
    expect(nodes.map((n) => n.id)).toEqual([
      'education',
      'euromov-digital-health-in-motion',
      'vaisala',
      'sanofi',
      'ecole-des-mines-ales',
      'genfit',
    ]);
  });

  test('alternates sides starting with the education node on the left', () => {
    expect(nodes.map((n) => n.side)).toEqual(['left', 'right', 'left', 'right', 'left', 'right']);
  });

  test('marks only the GENFIT node as current', () => {
    const current = nodes.filter((n) => n.current).map((n) => n.id);
    expect(current).toEqual(['genfit']);
  });

  test('strips the tech-stack line out of bullets and into tags', () => {
    const genfit = nodes.find((n) => n.id === 'genfit');
    expect(genfit.bullets).toEqual(['Did A.', 'Did B.']);
    expect(genfit.tags).toEqual(['Python', 'FastAPI']);
  });

  test('uses only the primary institution for the education node', () => {
    const educationNode = nodes.find((n) => n.id === 'education');
    expect(educationNode.org).toBe('IMT MINES ALES');
    expect(educationNode.tags.length).toBeGreaterThan(0);
  });
});
