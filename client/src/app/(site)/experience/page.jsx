import ExperienceTimeline from '@/components/ExperienceTimeline';

// Your experience and education data, pulled from your resume
const experienceData = [
  {
    type: 'professional',
    duration: 'Jun 2025 - Aug 2025',
    role: 'Full Stack Developer Intern',
    company: 'AI-DROM GLOBAL PVT. LTD., Noida, UP',
    description: [
      'Contributed to the development and maintenance of full-stack web applications using the MERN stack.',
      'Developed and integrated RESTful APIs to ensure seamless data communication.',
      'Collaborated with the development team to troubleshoot bugs and implement new features.'
    ]
  },
  {
    type: 'professional',
    duration: 'Jul 2024 - Nov 2024',
    role: 'Full Stack Web Developer Intern',
    company: 'Softpro India',
    description: [
      'Developed and deployed a full-stack web application using the MERN stack, contributing to both the interactive React.js frontend and the robust Node.js/Express.js backend.'
    ]
  },
  {
    type: 'professional',
    duration: 'Aug 2023 - Oct 2023',
    role: 'Machine Learning & Data Science Intern',
    company: 'YBI Foundation',
    description: [
      'Engineered complete machine learning pipelines, from data preprocessing and feature engineering with Pandas to model development using Scikit-Learn.'
    ]
  },
  {
    type: 'education',
    duration: 'Sep 2022 - Oct 2026',
    role: 'Bachelor of Technology - Computer Science',
    company: 'Babu Banarsi Das Institute of Technology, Ghaziabad',
    description: []
  },
  {
    type: 'education',
    duration: 'Apr 2021 - May 2022',
    role: 'Class XII (CBSE Board)',
    company: 'KC Mount Fort School, Muzaffarpur',
    description: ['Percentage: 71.4%']
  },
  {
    type: 'education',
    duration: 'Apr 2019 - Mar 2020',
    role: 'Class X (CBSE Board)',
    company: 'DAV Public School, Muzaffarpur',
    description: ['Percentage: 81.2%']
  }
];

// The data fetching function is no longer needed

// This is now a simple component, not an async one
export default function ExperiencePage() {
  return (
    <div className="bg-background ">
      <ExperienceTimeline experience={experienceData} />
    </div>
  );
}