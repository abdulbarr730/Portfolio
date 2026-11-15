// Fallback site settings. The live values come from the admin panel (/api/settings);
// these are only used while loading or if the API can't be reached.
import { asset } from '@/lib/asset';

export const siteDefaults = {
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
    photoUrl: asset('/profile.png'),
    outlineName: 'Abdul Barr',
    sidebarText: 'Full-Stack & ML Developer',
    stats: [
      { value: '3+', label: 'Years of Experience', href: '/experience' },
      { value: '', label: 'Projects Completed', href: '/projects' },
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
    milestones: [
  { year: '2021', text: 'Started my journey into web development, building foundational projects with React and Node.js.' },
  { year: '2023', text: 'Began taking on freelance work, successfully delivering e-commerce sites and portfolio pages for clients.' },
  { year: '2023+', text: 'Secured internships annually, gaining hands-on experience in both Full-Stack and Machine Learning environments.' },
  { year: '2026', text: 'Joined ProSync Infotech Private Limited as a Software Developer, building production systems used company-wide.' }
],
    certifications: [
  {
    name: 'Building with the Claude API',
    issuer: 'Claude Anthropic',
    link: 'https://verify.skilljar.com/c/rsdbnkasqhb7'
  },
  {
    name: 'Prompt Design in Vertex AI',
    issuer: 'Google',
    link: 'https://www.cloudskillsboost.google/public_profiles/709def08-7018-4ba2-ada5-c38085efba66/badges/17305399'
  },
  {
    name: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG',
    issuer: 'Google',
    link: 'https://www.cloudskillsboost.google/public_profiles/709def08-7018-4ba2-ada5-c38085efba66/badges/17410538'
  },
  {
    name: 'Build Real World AI Applications with Gemini and Imagen',
    issuer: 'Google',
    link: 'https://www.cloudskillsboost.google/public_profiles/709def08-7018-4ba2-ada5-c38085efba66/badges/17343087'
  },
  {
    name: 'Node.js Development',
    issuer: 'Lets Upgrade',
    link: 'https://verify.letsupgrade.in/certificate/LUENJSAPR125467'
  },
  {
    name: 'Low-Level Design (LLD) of Payment Apps',
    issuer: 'Scaler',
    link: 'https://moonshot.scaler.com/s/sl/duGPtR04Jv'
  },
  {
    name: 'Campus Ambassador',
    issuer: 'IIT Delhi Rendezvous \'23',
    link: 'https://drive.google.com/file/d/1u-ILxv45g8aRHnOBVPjTyMqKhrMHkywB/view?usp=drive_link'
  },
  {
    name: 'Event Anchor & Host',
    issuer: 'College Fresher\'s Party',
    link: '' // no link available
  }
],
    photoUrl: asset('/profile2.png'),
    photoFit: 'cover',
    photoPosition: 'center',
    photoAspect: 'portrait',
    photoBadge: true,
  },
  // Landing page sections, in order (hero is always first)
  homeSections: [
    { key: 'about', hidden: false },
    { key: 'journey', hidden: false },
    { key: 'work', hidden: false },
    { key: 'services', hidden: false },
    { key: 'toolkit', hidden: false },
    { key: 'certifications', hidden: false },
    { key: 'writing', hidden: false },
    { key: 'testimonials', hidden: false },
    { key: 'contact', hidden: false },
  ],
  blogCovers: [],
  toolkit: [
  { name: 'React', logo: asset('/logos/react.svg') },
  { name: 'Next.js', logo: asset('/logos/nextjs.svg') },
  { name: 'Node.js', logo: asset('/logos/nodejs.svg') },
  { name: 'Express', logo: asset('/logos/express.svg') },
  { name: 'MongoDB', logo: asset('/logos/mongodb.svg') },
  { name: 'GSAP', logo: asset('/logos/gsap.svg') },
  { name: 'Framer Motion', logo: asset('/logos/framer.svg') },
  { name: 'Python', logo: asset('/logos/python.svg') },
  { name: 'Scikit-Learn', logo: asset('/logos/sklearn.svg') },
  { name: 'Docker', logo: asset('/logos/docker.svg') },
  { name: 'Kubernetes', logo: asset('/logos/kubernetes.svg') },
  { name: 'Git & GitHub', logo: asset('/logos/git.svg') },
],
  menu: [
    { text: 'View Resume', id: 'https://drive.google.com/file/d/1vnZADDPLb2hbOnx8Fi3W0m8LEesof_z6/view?usp=drive_link', type: 'link', newTab: true, cta: '', hidden: false },
    { text: 'Home', id: 'hero', type: 'scroll', newTab: false, cta: '', hidden: false },
    { text: 'Blog', id: '/blog', type: 'link', newTab: false, cta: '', hidden: false },
    { text: 'About Me', id: 'about', type: 'scroll', newTab: false, cta: '', hidden: false },
    { text: 'Projects', id: '/projects', type: 'link', newTab: false, cta: '', hidden: false },
    { text: 'Services', id: '/services', type: 'link', newTab: false, cta: '', hidden: false },
    { text: 'Code Craft', id: '/codecraft', type: 'link', newTab: false, cta: '', hidden: false },
    { text: 'Review', id: 'reviews', type: 'scroll', newTab: false, cta: 'Drop a review if you liked anything about me or my projects', hidden: false },
    { text: 'Experience', id: '/experience', type: 'link', newTab: false, cta: '', hidden: false },
    { text: 'Contact', id: '/contact', type: 'link', newTab: false, cta: '', hidden: false },
  ],
  // Floating dock (action: 'link' | 'top' | 'bottom' | 'divider')
  dock: [
    { label: 'Home', icon: 'Home', action: 'link', href: '/', newTab: false, hidden: false },
    { label: 'Top', icon: 'ArrowUp', action: 'top', href: '', newTab: false, hidden: false },
    { label: 'Bottom', icon: 'ArrowDown', action: 'bottom', href: '', newTab: false, hidden: false },
    { label: 'Divider', icon: '', action: 'divider', href: '', newTab: false, hidden: false },
    { label: 'Projects', icon: 'Code', action: 'link', href: '/projects', newTab: false, hidden: false },
    { label: 'Services', icon: 'Briefcase', action: 'link', href: '/services', newTab: false, hidden: false },
    { label: 'LinkedIn', icon: 'Linkedin', action: 'link', href: 'https://www.linkedin.com/in/abdul-barr-9092a4251', newTab: true, hidden: false },
    { label: 'Resume', icon: 'FileText', action: 'link', href: 'https://drive.google.com/file/d/1vnZADDPLb2hbOnx8Fi3W0m8LEesof_z6/view?usp=drive_link', newTab: true, hidden: false },
  ],
  socials: {
    github: 'https://github.com/abdulbarr730',
    linkedin: 'https://www.linkedin.com/in/abdul-barr-9092a4251',
    email: 'hello@abdulbarr.in',
  },
};
