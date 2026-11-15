'use client';

import ExperienceTimeline from '@/components/ExperienceTimeline';
import { useExperience } from '@/lib/content';

export default function ExperiencePage() {
  const { experience: experienceData } = useExperience();
  return (
    <div className="bg-background ">
      <ExperienceTimeline experience={experienceData} />
    </div>
  );
}