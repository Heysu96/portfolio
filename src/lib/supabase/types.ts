// Database types for Supabase tables

// Category table
export interface DbCategory {
  id: string;
  key: string;
  label: string;
  sort_order: number;
  created_at: string;
}

// Project table
export interface DbProject {
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
}

// Media table
export interface DbMedia {
  id: string;
  project_id: string;
  type: "image" | "video";
  src: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

// Project with categories and media (joined result)
export interface ProjectWithDetails extends DbProject {
  categories: DbCategory[];
  media: DbMedia[];
}

// Category with project count
export interface CategoryWithCount extends DbCategory {
  count: number;
}

// Legacy types for backward compatibility
export type Category = "all" | "web" | "ai-video" | "etc";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: Category[];
  date: string;
  tags: string[];
  thumbnail: string;
  description: string;
  media: MediaItem[];
}

// Convert database project to legacy format
export function toProject(project: ProjectWithDetails): Project {
  return {
    id: project.id,
    title: project.title,
    category: project.categories.map((c) => c.key as Category),
    date: project.date,
    tags: project.tags,
    thumbnail: project.thumbnail,
    description: project.description,
    media: project.media.map((m) => ({
      type: m.type,
      src: m.src,
      alt: m.alt ?? undefined,
    })),
  };
}

// Convert database categories to legacy format with count
export function toCategoryList(
  categories: CategoryWithCount[]
): { key: Category; label: string; count: number }[] {
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);
  return [
    { key: "all" as Category, label: "ALL", count: allCount },
    ...categories.map((c) => ({
      key: c.key as Category,
      label: c.label,
      count: c.count,
    })),
  ];
}
