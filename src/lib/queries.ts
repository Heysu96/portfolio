import { createClient } from "@/lib/supabase/server";
import type {
  DbCategory,
  DbMedia,
  ProjectWithDetails,
  CategoryWithCount,
  Project,
  Category,
} from "@/lib/supabase/types";
import { toProject, toCategoryList } from "@/lib/supabase/types";

// Raw project data from Supabase query
interface RawProject {
  id: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  project_categories: { category: DbCategory }[];
  media: DbMedia[];
}

// Get all published projects with categories and media
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_categories(category:categories(*)),
      media(*)
    `
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  // Transform data structure
  const projectsWithDetails: ProjectWithDetails[] = (
    projects as RawProject[]
  ).map((p) => ({
    ...p,
    categories: p.project_categories.map((pc) => pc.category),
    media: p.media.sort((a, b) => a.sort_order - b.sort_order),
  }));

  return projectsWithDetails.map(toProject);
}

// Get all categories with project counts
export async function getCategories(): Promise<
  { key: Category; label: string; count: number }[]
> {
  const supabase = await createClient();

  // Get all categories
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (catError) {
    console.error("Error fetching categories:", catError);
    return [];
  }

  // Get project counts per category
  const { data: projectCategories, error: pcError } = await supabase
    .from("project_categories")
    .select(
      `
      category_id,
      projects!inner(is_published)
    `
    )
    .eq("projects.is_published", true);

  if (pcError) {
    console.error("Error fetching project categories:", pcError);
    return [];
  }

  // Calculate counts
  const categoriesWithCount: CategoryWithCount[] = (
    categories as DbCategory[]
  ).map((cat) => ({
    ...cat,
    count: projectCategories?.filter((pc) => pc.category_id === cat.id).length ?? 0,
  }));

  return toCategoryList(categoriesWithCount);
}

// Get a single project by ID (for admin)
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_categories(category:categories(*)),
      media(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  const rawProject = project as RawProject;
  const projectWithDetails: ProjectWithDetails = {
    ...rawProject,
    categories: rawProject.project_categories.map((pc) => pc.category),
    media: rawProject.media.sort((a, b) => a.sort_order - b.sort_order),
  };

  return toProject(projectWithDetails);
}

// Get all projects including unpublished (for admin)
export async function getAllProjects(): Promise<ProjectWithDetails[]> {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_categories(category:categories(*)),
      media(*)
    `
    )
    .order("sort_order", { ascending: false });

  if (error) {
    console.error("Error fetching all projects:", error);
    return [];
  }

  return (projects as RawProject[]).map((p) => ({
    ...p,
    categories: p.project_categories.map((pc) => pc.category),
    media: p.media.sort((a, b) => a.sort_order - b.sort_order),
  }));
}

// Get all categories (for admin)
export async function getAllCategories(): Promise<DbCategory[]> {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories as DbCategory[];
}
