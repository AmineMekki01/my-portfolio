const EXPERIENCE_ORDER = [
  'EuroMov Digital Health in Motion',
  'Vaisala',
  'Sanofi',
  'Ecole des Mines Alès',
  'GENFIT',
  'SeqOne',
];

const TECH_LINE = /^(tech stack|stack technique)\s*:/i;
const CURRENT_PATTERN = /present|présent/i;

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildJourneyNodes({ education, experience, typeLabels, educationTitle, educationDesc }) {
  const educationNode = {
    id: 'education',
    type: typeLabels.education,
    period: education[0] ? education[0].range : '',
    title: educationTitle,
    org: education[0] ? education[0].institution : '',
    desc: educationDesc,
    bullets: [],
    tags: Array.from(
      new Set(education.flatMap((entry) => entry.courses.split(',').map((c) => c.trim())))
    ).slice(0, 4),
    current: false,
  };

  const sortedExperience = [...experience].sort(
    (a, b) => EXPERIENCE_ORDER.indexOf(a.company) - EXPERIENCE_ORDER.indexOf(b.company)
  );

  const experienceNodes = sortedExperience.map((job) => {
    const techLine = job.description.find((line) => TECH_LINE.test(line));
    const bullets = job.description.filter((line) => !TECH_LINE.test(line));
    const tags = techLine
      ? techLine.split(':')[1].trim().replace(/\.$/, '').split(',').map((t) => t.trim())
      : [];
    const id = slugify(job.company);

    return {
      id,
      type: typeLabels[id] || job.title,
      period: job.range,
      title: job.title,
      org: `${job.company} · ${job.location}`,
      desc: '',
      bullets,
      tags,
      current: CURRENT_PATTERN.test(job.range),
    };
  });

  return [educationNode, ...experienceNodes].map((node, index) => ({
    ...node,
    side: index % 2 === 0 ? 'left' : 'right',
  }));
}
