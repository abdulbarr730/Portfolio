import HeroSection from '@/components/HeroSection';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* Sections below the hero: order and visibility come from admin → Home */}
      <HomeContent />
    </>
  );
}
