// app/privacy/page.jsx

export const metadata = {
  title: 'Privacy Policy | Abdul Barr',
  description: 'Privacy Policy for abdulbarr.in — how your data is handled.',
};

const sections = [
  {
    title: '01 — Overview',
    content: `This Privacy Policy explains how Abdul Barr ("I", "me", or "my") handles information when you visit abdulbarr.in (the "Site"). I take your privacy seriously and collect minimal data. This site is a personal portfolio — not a commercial product — so the data involved is limited.`,
  },
  {
    title: '02 — Information I Collect',
    items: [
      {
        label: 'Contact Form Data',
        text: 'When you submit the contact form, I receive your name, email address, and message. This is used solely to respond to your inquiry.',
      },
      {
        label: 'Newsletter Subscription',
        text: 'If you subscribe to updates, your email address is stored to send blog and project notifications. You can unsubscribe anytime.',
      },
      {
        label: 'Review / Testimonials',
        text: 'If you leave a review, the content and any name you provide may be displayed publicly on the site.',
      },
      {
        label: 'Usage Data',
        text: 'I may use basic analytics (e.g., Vercel Analytics) to understand page visits, device type, and region. No personally identifiable information is tied to this data.',
      },
    ],
  },
  {
    title: '03 — How I Use Your Information',
    items: [
      { text: 'To respond to your messages or inquiries' },
      { text: 'To send project and blog updates (newsletter only)' },
      { text: 'To display public reviews on the site (with your consent)' },
      { text: 'To improve site performance and user experience' },
    ],
  },
  {
    title: '04 — Cookies & Tracking',
    content: `This site may use minimal cookies for functional purposes (e.g., session handling). I do not use advertising cookies, cross-site trackers, or sell your data to third parties. You can disable cookies in your browser settings at any time.`,
  },
  {
    title: '05 — Third-Party Services',
    items: [
      { label: 'Vercel', text: 'Hosting and deployment. May log request metadata.' },
      { label: 'Google Drive', text: 'Resume file is hosted on Google Drive for download.' },
      { label: 'Formspree / Contact Backend', text: 'Handles contact form submissions securely.' },
      { label: 'Cal.com / Appointment Booking', text: 'If you book an appointment, Cal.com\'s own privacy policy applies.' },
      {label: 'Resend',text: 'Used to send transactional and newsletter emails.'}
    ],
  },
  {
    title: '06 — Data Retention',
    content: `Contact and newsletter data is retained until you request deletion or unsubscribe. Unverified newsletter entries may be automatically removed after a limited time. You may request deletion of your data at any time by emailing at hello@abdulbarr.in.`,
  },
  {
    title: '07 — Your Rights',
    items: [
      { text: 'Request access to data I hold about you' },
      { text: 'Request correction or deletion of your data' },
      { text: 'Unsubscribe from newsletters at any time' },
      { text: 'Withdraw consent for public reviews' },
    ],
  },
  {
    title: '08 — Changes to This Policy',
    content: `I may update this Privacy Policy occasionally. Changes will be reflected on this page with an updated date. Continued use of the site after changes constitutes acceptance.`,
  },
  {
    title: '09 — Contact',
    content: `For any privacy-related questions or requests, reach out at hello@abdulbarr.in.`,
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
          Last updated: <span className="text-primary/70">Apr 2026</span>
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