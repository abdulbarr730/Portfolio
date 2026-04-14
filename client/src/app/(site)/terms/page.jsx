// app/terms/page.jsx

export const metadata = {
  title: 'Terms & Conditions | Abdul Barr',
  description: 'Terms and Conditions for using abdulbarr.in.',
};

const sections = [
  {
    title: '01 — Acceptance of Terms',
    content: `By accessing and using abdulbarr.in (the "Site"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this Site. These terms apply to all visitors, clients, and anyone who interacts with the Site or its owner.`,
  },
  {
    title: '02 — Intellectual Property',
    content: `All content on this Site — including but not limited to text, design, code, images, project work, and branding — is the intellectual property of Abdul Barr unless otherwise stated. You may not reproduce, distribute, or use any content from this Site without explicit written permission.`,
  },
  {
    title: '03 — Use of the Site',
    items: [
      { text: 'You agree to use the Site only for lawful purposes.' },
      { text: 'You must not attempt to gain unauthorized access to any part of the Site or its infrastructure.' },
      { text: 'You must not use the Site to transmit spam, malware, or any harmful content.' },
      { text: 'Scraping or automated data collection from this Site is prohibited without prior permission.' },
    ],
  },
  {
    title: '04 — Services & Freelance Engagements',
    content: `If you engage Abdul Barr for freelance or consulting work, separate agreements (contracts, proposals, or invoices) will govern those engagements. These Terms & Conditions do not constitute a service agreement. All project terms, timelines, payment, and deliverables will be defined in a separate written agreement.`,
  },
  {
    title: '05 — Contact Form & Communications',
    content: `Submitting the contact form or booking an appointment does not create a binding contract or guarantee of service. I will respond to genuine inquiries in good faith. Spam, unsolicited sales outreach, or abusive communications will be disregarded.`,
  },
  {
    title: '06 — Reviews & Testimonials',
    content: `By submitting a review or testimonial on this Site, you grant Abdul Barr a non-exclusive, royalty-free license to display it publicly on the Site and in related promotional materials. You confirm the review is genuine and based on a real interaction or experience.`,
  },
  {
  title: '07 — Content & Information',
    content: `The content on this Site reflects my work, experience, and understanding at the time of writing. I strive to keep all information accurate and up to date.

    Some technical content, code examples, or project details are shared for informational purposes and may require adaptation for specific use cases. I am not liable for any issues arising from the use of information or code snippets provided on this Site. Always test and review any code before applying it to your projects.`,
    },
  {
    title: '08 — Limitation of Liability',
    content: `To the fullest extent permitted by law, Abdul Barr shall not be liable for any indirect, incidental, or consequential damages arising from your use of this Site or its content. My total liability in any matter related to this Site is limited to zero, as this is a free personal portfolio.`,
  },
  {
    title: '09 — External Links',
    content: `This Site may contain links to third-party websites (GitHub, LinkedIn, Google Drive, Calendly, etc.). I am not responsible for the content, privacy practices, or availability of those external sites. Accessing them is at your own risk.`,
  },
  {
    title: '10 — Governing Law',
    content: `These Terms are governed by the laws of India. Any disputes arising from the use of this Site shall be subject to the jurisdiction of courts in Uttar Pradesh, India.`,
  },
  {
    title: '11 — Changes to These Terms',
    content: `I reserve the right to update these Terms at any time. Updates will be reflected on this page with a revised date. Continued use of the Site after updates constitutes acceptance of the new Terms.`,
  },
  {
    title: '12 — Contact',
    content: `For any questions about these Terms, please contact hello@abdulbarr.in.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-primary px-6 md:px-16 lg:px-32 py-24">
      {/* Header */}
      <div className="mb-16 border-b border-primary/10 pb-10">
        <p className="text-secondary text-xs uppercase tracking-[0.3em] mb-3">Legal</p>
        <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-primary mb-4">
          Terms & Conditions
        </h1>
        <p className="text-secondary text-sm">
          Last updated: <span className="text-primary/70">April 2026</span>
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