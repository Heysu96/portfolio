import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import SkillsFloating from "@/components/home/SkillsFloating";
import StatsSection from "@/components/home/StatsSection";
import FeaturedWorks from "@/components/home/FeaturedWorks";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <SkillsFloating />
      <StatsSection />
      <FeaturedWorks />
    </>
  );
}
