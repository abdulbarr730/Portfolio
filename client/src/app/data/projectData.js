// app/data/projectData.js

export const allProjectsData = [
  {
    title: "SIH College Portal",
    category: "Full Stack",
    description: "A full-stack app to manage college hackathons.",
    detailedDescription:
      "The SIH College Portal was built with immense focus and passion as a full-fledged system to streamline Smart India Hackathon processes at the college level. Every feature — from secure JWT authentication to mentor assignment and team management — was crafted through careful planning and testing. It wasn’t just about writing code, but understanding how different user roles interact within an academic ecosystem.",
    problemSolved:
      "On the official SIH portal, only the college SPOC can view registered teams, leaving students completely in the dark. My portal fixes this by providing an authenticated internal platform for students to view, join, and manage teams transparently.",
    challengesFaced:
      "Free-tier hosting blocked SMTP ports for email verification, forcing a pivot to Resend API. Building a scraper for live notifications and alternate ID verification were also challenging.",
    futureScope:
      "Ready to scale into a SaaS where any college can host their own internal hackathon portal.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB", "Supabase"],
    liveUrl: "https://hackathon-college-portal.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/sih-portal.png",
    impact: { metric: "80+", label: "Student Signups" },
  },
  {
    title: "Midafco (Saudi Arabia)",
    category: "Branding & IT",
    description: "Bilingual (Arabic/English) corporate identity and IT infrastructure.",
    detailedDescription:
      "A complete digital overhaul for a Saudi Arabian client, Mijdaf Al Arabia (Midafco). I developed their corporate identity (Logo, Letterhead, Profile) and engineered a proposal for their IT and email infrastructure. This project was unique because it required a fully bilingual approach, ensuring the brand identity worked seamlessly in both Arabic and English contexts.",
    problemSolved:
      "The client needed to bid for high-value government contracts in Saudi Arabia but lacked the professional digital footprint required to be taken seriously.",
    challengesFaced:
      "Integrating Arabic was difficult. Managing RTL (Right-to-Left) typography while maintaining a modern aesthetic in a bilingual document required precise layout adjustments and cultural sensitivity.",
    futureScope: "Development of a full-scale ERP system for their inventory management.",
    technologies: ["Adobe Suite", "System Architecture", "Business Logic"],
    liveUrl: "https://midafco.vercel.app/", 
    githubUrl: "https://github.com/abdulbarr730/midafco",
    snapshotUrl: "/snapshots/midafco.png", 
    impact: { metric: "Bilingual", label: "English & Arabic (عربي)" },
  },
  {
    title: "College Placement Tracker",
    category: "Academic Management",
    description: "Centralized dashboard for tracking student applications and placement drives.",
    detailedDescription:
      "A full-stack solution designed to bridge the gap between students and the Training & Placement (T&P) department. It features a student portal for applying to drives and a robust admin panel where authorities can monitor live application status, filter by GPA/branch, and export data.",
    problemSolved:
      "Teachers and authorities were completely blind to who applied for which drive. This system eliminated manual tracking and gave them real-time visibility into student participation.",
    challengesFaced:
      "Designing a database schema that efficiently maps thousands of students to multiple concurrent job drives without redundancy.",
    futureScope: "Integrating automated email notifications and WhatsApp alerts for new drives.",
    technologies: ["Next.js", "Node.js", "MongoDB", "ExcelJS"],
    liveUrl: "/jobs",
    githubUrl: "https://github.com/abdulbarr730/Portfolio",
    snapshotUrl: "/snapshots/placement-tracker.png", 
    impact: { metric: "100%", label: "Data Visibility" },
  },
  {
    title: "Nayi Kiran NGO",
    category: "Web Development",
    description: "Official website for Nayi Kiran Foundation to drive awareness and outreach.",
    detailedDescription:
      "A clean, accessible, and fast-loading website built for the Nayi Kiran Foundation. The goal was to establish a digital presence that builds trust with potential donors and volunteers. It features gallery sections, event timelines, and a contact interface, optimized for performance across rural internet connections.",
    problemSolved:
      "The NGO lacked a credible digital identity, making it difficult to partner with larger organizations or showcase their grassroots impact to the world.",
    challengesFaced:
      "Ensuring high performance and accessibility (Lighthouse score 95+) while using heavy image assets for the gallery.",
    futureScope: "Integrating a payment gateway for direct donations.",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://nayi-kiran-ngo.vercel.app/", 
    githubUrl: "https://github.com/abdulbarr730/nayi-kiran-ngo",
    snapshotUrl: "/snapshots/nayi-kiran.png",
  },
  {
    title: "AI Meeting Notes Summarizer",
    category: "AI & ML",
    description: "Uses Groq API + Llama 3 to summarize meeting transcripts.",
    detailedDescription:
      "This app automates meeting note-taking. It uses Llama 3 with optimized prompts to produce structured summaries from uploaded transcripts, saving professionals hours of work.",
    problemSolved:
      "Manual meeting note-taking wastes hours. This tool provides instant summaries using Groq API.",
    challengesFaced:
      "Getting Llama 3 to produce consistently structured, concise outputs required deep prompt tuning.",
    futureScope:
      "Add real-time transcription and support for audio uploads (.mp3, .m4a).",
    technologies: ["React", "Node.js (Serverless)", "Groq API", "Llama 3", "Vercel"],
    liveUrl: "https://meeting-summarizer-black.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/ai-summarizer.png",
  },
  {
    title: "E-commerce Website - Two Good Co.",
    category: "Frontend Motion",
    description: "Motion-rich e-commerce frontend built with GSAP + Locomotive.",
    detailedDescription:
      "A pixel-perfect e-commerce concept with smooth GSAP + Locomotive Scroll transitions. Focused on combining storytelling and UI elegance for a premium brand feel.",
    problemSolved:
      "Static sites lack engagement. This one fuses brand storytelling with scroll-based interaction.",
    challengesFaced:
      "Optimizing GSAP + Locomotive for performance on all devices was tough.",
    futureScope:
      "Integrate with a headless e-commerce backend (Shopify, Medusa.js).",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Locomotive Scroll"],
    liveUrl: "https://twogood-e-commerce.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/two-good.png",
  },
  {
    title: "GTA-VI Re-imagined Website",
    category: "Creative Dev",
    description: "Cinematic React concept inspired by GTA-VI, powered by GSAP.",
    detailedDescription:
      "Built to push the boundaries of web animation, this site recreates the immersive, high-energy atmosphere of GTA-VI using advanced GSAP scroll timelines.",
    problemSolved:
      "Game websites are static. This experiment brings cinematic interactivity to web design.",
    challengesFaced:
      "Managing layered scroll-triggered animations without frame drops.",
    futureScope:
      "Add Three.js elements and interactive Easter eggs.",
    technologies: ["ReactJs", "GSAP"],
    liveUrl: "https://gta-vi-imagine.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/gta-vi.png",
  },
  {
    title: "Weather Project",
    category: "Utility",
    description: "A clean weather forecasting app using OpenWeather API.",
    detailedDescription:
      "Simple yet precise — it provides real-time weather info with a minimalist UI.",
    problemSolved:
      "Most weather apps are cluttered. This focuses purely on clarity and speed.",
    challengesFaced:
      "Handled async API data, loading states, and error management elegantly.",
    futureScope:
      "Add geolocation-based auto-fetch and animated forecasts.",
    technologies: ["HTML", "CSS", "JavaScript", "OpenWeather API"],
    liveUrl: "https://weather-project-chi-two.vercel.app/",
    githubUrl: "https://github.com/abdulbarr730/Weather-Project",
    snapshotUrl: "/snapshots/weather.png",
  },
];