import { getProjects, getCategories } from "@/lib/queries";
import WorksClient from "@/components/works/WorksClient";

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function WorksPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ]);

  return <WorksClient projects={projects} categories={categories} />;
}
