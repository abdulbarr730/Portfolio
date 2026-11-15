// server/scripts/seedContent.js
// One-time import of the site's hard-coded content into MongoDB so the admin
// panel can manage it. Reads the current client source files directly.
//
//   node scripts/seedContent.js --dry-run
//   node scripts/seedContent.js
//
// Safe to re-run:
//   - settings: created only if missing (never overwrites admin edits)
//   - projects: upserted by title
//   - experience / services: inserted only when the collection is empty
require('dotenv').config({ quiet: true });
if (process.env.DNS_SERVERS) require('dns').setServers(process.env.DNS_SERVERS.split(','));

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const SiteSettings = require('../models/siteSettings.model');
const Project = require('../models/project.model');
const Experience = require('../models/experience.model');
const Service = require('../models/service.model');

const DRY = process.argv.includes('--dry-run');
const CLIENT = path.resolve(__dirname, '../../client/src');
const R2 = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
const assetUrl = (p) => (R2 ? `${R2}/static${p}` : p);

// Pull `const <name> = [ ... ];` out of a source file and evaluate the literal.
function extractArray(file, name, transform = (s) => s) {
  const src = fs.readFileSync(path.join(CLIENT, file), 'utf8');
  const start = src.indexOf(`const ${name} = [`);
  if (start === -1) throw new Error(`${name} not found in ${file}`);
  let i = src.indexOf('[', start);
  let depth = 0;
  let inStr = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (inStr) {
      if (c === '\\') j++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) {
      const literal = transform(src.slice(i, j + 1));
      // eslint-disable-next-line no-new-func
      return new Function('asset', `return ${literal};`)(assetUrl);
    }
  }
  throw new Error(`Could not parse ${name}`);
}

const projects = extractArray('app/data/projectData.js', 'allProjectsData');
const experience = extractArray('app/(site)/experience/page.jsx', 'experienceData');
const services = extractArray('components/ServicesSection.jsx', 'servicesData', (s) =>
  s.replace(/icon:\s*([A-Za-z0-9]+)\s*,/g, 'icon: "$1",')
);
const toolkit = extractArray('components/AboutSection.jsx', 'toolkit');
const milestones = extractArray('components/AboutSection.jsx', 'milestones');
const certifications = extractArray('components/AboutSection.jsx', 'certifications');

const settings = {
  key: 'main',
  accentColor: '#5E6B26',
  availability: { enabled: true, text: 'Built platforms serving 4,000+ clients' },
  hero: {
    greeting: 'Hello',
    headline: "Hello, I'm\nAbdul Barr",
    featureTitle: 'What I\nBuild',
    featureText: 'SaaS, CRMs and AI automation',
    pillsTitle: 'What I Do',
    pills: ['Full-Stack', 'AI & Automation', 'SaaS & CRM', 'Backend & APIs'],
    rolesDesktop: ['Full-Stack Developer', 'System Architect', 'Problem Solver', 'Machine Learning Enthusiast'],
    rolesMobile: ['Full-Stack Developer', 'System Architect', 'Problem Solver', 'AI & Automation Engineer'],
    tagline: "More than an ordinary developer; I don't just build features, I engineer solutions that last.",
    ctaTextDesktop: 'Wanna know how?? Click click',
    ctaTextMobile: 'Wanna know how?? Tap tap',
    ctaHref: '/codecraft',
    photoUrl: assetUrl('/profile.png'),
    outlineName: 'Abdul Barr',
    stats: [
      { value: '3+', label: 'Years of Experience', href: '/experience' },
      { value: '', label: 'Projects Completed', href: '/projects' }, // empty value = auto project count
    ],
  },
  about: {
    paragraphs: [
      "I'm a Software Developer at ProSync Infotech Private Limited, and a B.Tech Computer Science Engineering graduate (AKTU), focused on building full-stack systems that solve real operational problems — not just demo projects.",
      'I build SaaS platforms, web applications, and backend systems with a strong focus on structure, scalability, and real-world usability.',
    ],
    highlights: [
      { value: '4,000+', label: 'Client records managed (ProSync CRM)' },
      { value: '3+', label: 'Internships completed' },
      { value: '2+ yrs', label: 'Freelancing experience' },
      { value: 'Full Stack + AI', label: 'React, Next.js, Node, MongoDB, RAG, Models' },
    ],
    milestones,
    certifications,
    photoUrl: assetUrl('/profile2.png'),
  },
  toolkit,
  socials: {
    github: 'https://github.com/abdulbarr730',
    linkedin: 'https://www.linkedin.com/in/abdul-barr-9092a4251',
    email: '',
  },
};

(async () => {
  console.log(DRY ? '=== DRY RUN ===' : '=== Seeding content ===');
  console.log(
    `found: ${projects.length} projects, ${experience.length} experience, ${services.length} services, ` +
      `${toolkit.length} tools, ${milestones.length} milestones, ${certifications.length} certifications`
  );

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });

  // Settings
  const hasSettings = await SiteSettings.exists({ key: 'main' });
  console.log(`settings: ${hasSettings ? 'already exist, skipped' : DRY ? 'would create' : 'created'}`);
  if (!hasSettings && !DRY) await SiteSettings.create(settings);

  // Projects (upsert by title, keep source order)
  for (const [i, p] of projects.entries()) {
    const exists = await Project.exists({ title: p.title });
    console.log(`project "${p.title}": ${DRY ? (exists ? 'would update' : 'would create') : exists ? 'updated' : 'created'}`);
    if (!DRY) await Project.updateOne({ title: p.title }, { $set: { ...p, order: i } }, { upsert: true });
  }

  // Experience
  const expCount = await Experience.countDocuments();
  console.log(`experience: ${expCount ? `has ${expCount}, skipped` : DRY ? `would insert ${experience.length}` : `inserted ${experience.length}`}`);
  if (!expCount && !DRY) await Experience.insertMany(experience.map((e, i) => ({ ...e, order: i })));

  // Services
  const svcCount = await Service.countDocuments();
  console.log(`services: ${svcCount ? `has ${svcCount}, skipped` : DRY ? `would insert ${services.length}` : `inserted ${services.length}`}`);
  if (!svcCount && !DRY) await Service.insertMany(services.map((s, i) => ({ ...s, order: i })));

  await mongoose.disconnect();
  console.log('Done.');
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
