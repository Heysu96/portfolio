import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import SkillsFloating from "@/components/home/SkillsFloating";
import StatsSection from "@/components/home/StatsSection";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import { getProjects } from "@/lib/queries";

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <HeroSection />
      <StatementSection />
      <SkillsFloating />
      <StatsSection projectCount={projects.length} />
      <FeaturedWorks projects={featuredProjects} />
    </>
  );
}
