// server/models/siteSettings.model.js
// One document (key: "main") that holds every editable piece of site copy.
const mongoose = require('mongoose');

const linkStat = new mongoose.Schema({ value: String, label: String, href: String }, { _id: false });
const valueLabel = new mongoose.Schema({ value: String, label: String }, { _id: false });

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },

    // Hero 60/30/10 look: dark background, white text, brand colour as the accent
    heroTheme: {
      dark: { type: Boolean, default: false },
    },

    // Career start (YYYY-MM): {years} in any text = full years since this date
    careerStart: { type: String, default: '2023-01' },

    accentColor: { type: String, default: '#E5322D' },

    availability: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: 'Built platforms serving 4,000+ clients' },
    },

    hero: {
      greeting: { type: String, default: 'Hello' },
      headline: { type: String, default: "Hello, I'm\nAbdul Barr" },
      featureTitle: { type: String, default: 'What I\nBuild' },
      featureText: { type: String, default: 'SaaS, CRMs and AI automation' },
      pillsTitle: { type: String, default: 'What I Do' },
      pills: [String],
      rolesDesktop: [String],
      rolesMobile: [String],
      tagline: String,
      ctaTextDesktop: String,
      ctaTextMobile: String,
      ctaHref: { type: String, default: '/codecraft' },
      photoUrl: String,
      outlineName: { type: String, default: 'Abdul Barr' },
      sidebarText: { type: String, default: 'Full-Stack & ML Developer' },
      stats: [linkStat],
      showCertLine: { type: Boolean, default: true },
    },

    about: {
      paragraphs: [String],
      highlights: [valueLabel],
      milestones: [new mongoose.Schema({ year: String, text: String }, { _id: false })],
      certifications: [new mongoose.Schema({ name: String, issuer: String, link: String }, { _id: false })],
      photoUrl: String,
      photoFit: { type: String, enum: ['cover', 'contain'], default: 'cover' },
      photoPosition: { type: String, enum: ['top', 'center', 'bottom'], default: 'center' },
      photoAspect: { type: String, enum: ['portrait', 'tall', 'square', 'landscape'], default: 'portrait' },
      photoBadge: { type: Boolean, default: true },
    },

    // Landing page sections (order + visibility). Hero is always shown.
    homeSections: [new mongoose.Schema({ key: String, hidden: { type: Boolean, default: false } }, { _id: false })],

    // Cover image overrides for Medium posts (matched by post link)
    blogCovers: [new mongoose.Schema({ link: String, image: String }, { _id: false })],

    toolkit: [new mongoose.Schema({ name: String, logo: String }, { _id: false })],

    // Floating dock buttons
    dock: [
      new mongoose.Schema(
        {
          label: String,
          icon: String,
          action: { type: String, enum: ['link', 'top', 'bottom', 'divider'], default: 'link' },
          href: String,
          newTab: { type: Boolean, default: false },
          hidden: { type: Boolean, default: false },
        },
        { _id: false }
      ),
    ],

    // Slide-out menu links (type 'link' = page/URL, 'scroll' = section id on the home page)
    menu: [
      new mongoose.Schema(
        {
          text: String,
          id: String,
          type: { type: String, enum: ['link', 'scroll'], default: 'link' },
          newTab: { type: Boolean, default: false },
          cta: String,
          navbar: Boolean, // show in the desktop top bar (unset = default pages)
          hidden: { type: Boolean, default: false },
        },
        { _id: false }
      ),
    ],

    socials: {
      github: String,
      linkedin: String,
      email: String,
    },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
