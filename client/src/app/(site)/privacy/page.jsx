// app/privacy/page.jsx

export const metadata = {
  title: 'Privacy Policy | Abdul Barr',
  description: 'Privacy Policy for abdulbarr.in — how your data is handled.',
};

const sections = [
  {
    title: '01 — Overview',
    content: `This Privacy Policy explains how Abdul Barr ("I", "me", or "my") handles information when you visit abdulbarr.in (the "Site"). I take your privacy seriously and collect minimal data. This site is a personal portfolio — not a commercial product — so the data involved is strictly limited to functional and communication purposes.`,
  },
  {
    title: '02 — Information I Collect',
    items: [
      {
        label: 'Contact Form Data',
        text: 'When you submit a contact form, I receive your name, email address, and message. This is used solely to respond to your inquiry.',
      },
      {
        label: 'Newsletter Subscription',
        text: 'If you subscribe to updates, your email address, consent timestamps, and verification status are stored in my database to send blog and project notifications.',
      },
      {
        label: 'Security & Technical Data',
        text: 'For server security and rate-limiting (preventing bot attacks), the server temporarily processes IP addresses. This data is not permanently stored or tied to your identity.',
      },
      {
        label: 'Usage Data',
        text: 'I use basic analytics (e.g., Vercel Analytics) to understand page visits, device types, and regions. This data is aggregated and contains no personally identifiable information.',
      },
    ],
  },
  {
    title: '03 — How I Use Your Information',
    items: [
      { text: 'To respond to your messages or inquiries.' },
      { text: 'To send project and blog updates (only if explicitly verified via email).' },
      { text: 'To display public reviews on the site (only with your explicit consent).' },
      { text: 'To protect the server infrastructure from spam, abuse, and automated attacks.' },
    ],
  },
  {
    title: '04 — Cookies & Tracking',
    content: `This site may use minimal cookies or local storage for functional purposes (e.g., UI preferences). I do not use advertising cookies, cross-site trackers, or sell your data to third parties.`,
  },
  {
    title: '05 — Infrastructure & Third-Party Services',
    content: `To run this Site, I rely on the following infrastructure providers, each governed by their own privacy policies:`,
    items: [
      { label: 'Vercel', text: 'Frontend hosting and deployment. May log basic request metadata.' },
      { label: 'MongoDB', text: 'Cloud database used to securely store subscriber emails and consent records.' },
      { label: 'Resend', text: 'Email API used to securely route and deliver transactional and newsletter emails.' },
      { label: 'Formspree', text: 'Handles contact form submissions securely (if applicable).' },
      { label: 'Google Drive', text: 'Hosts the downloadable resume file.' },
    ],
  },
  {
    title: '06 — Data Retention',
    content: `Newsletter data is retained until you request deletion or click "Unsubscribe." Unverified subscription attempts are automatically purged from the database after a limited time. You may request total deletion of your data at any time by emailing hello@abdulbarr.in.`,
  },
  {
    title: '07 — Your Rights',
    items: [
      { text: 'Request access to the exact data I hold about you.' },
      { text: 'Request immediate correction or total deletion of your data.' },
      { text: 'Unsubscribe from newsletters instantly via the link in any email.' },
      { text: 'Withdraw consent for public reviews or communications at any time.' },
    ],
  },
  {
    title: '08 — Changes to This Policy',
    content: `I may update this Privacy Policy to reflect infrastructure or legal changes. Updates will be reflected on this page with an updated date. Continued use of the site after changes constitutes acceptance.`,
  },
  {
    title: '09 — Contact',
    content: `For any privacy-related questions, data export requests, or deletion requests, reach out directly at hello@abdulbarr.in.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-primary px-6 md:px-16 lg:px-32 py-24">
      {/* Header */}
      <div className="mb-16 border-b border-primary/10 pb-10">
        <p className="text-secondary text-xs uppercase tracking-[0.3em] mb-3">Legal</p>
        <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-secondary text-sm">
          Last updated: <span className="text-primary/70">June 2026</span>
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-14 max-w-3xl">
        {sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-primary/90 mb-4 tracking-tight">
              {section.title}
            </h2>

            {section.content && (
              <p className="text-secondary leading-relaxed text-sm">{section.content}</p>
            )}

            {section.items && (
              <ul className="space-y-3 mt-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm text-secondary leading-relaxed">
                    <span className="text-primary/40 mt-1 shrink-0">—</span>
                    <span>
                      {item.label && (
                        <span className="text-primary font-medium">{item.label}: </span>
                      )}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}