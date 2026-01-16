import { notFound } from "next/navigation";
import { getAllCategories } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { DbCategory, DbMedia, ProjectWithDetails } from "@/lib/supabase/types";

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

async function getProject(id: string): Promise<ProjectWithDetails | null> {
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

  if (error || !project) {
    return null;
  }

  const rawProject = project as RawProject;
  return {
    ...rawProject,
    categories: rawProject.project_categories.map((pc) => pc.category),
    media: rawProject.media.sort((a, b) => a.sort_order - b.sort_order),
  };
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProject(id),
    getAllCategories(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 수정</h1>
          <p className="text-gray-500 mt-1">{project.title}</p>
        </div>
      </div>

      {/* Form */}
      <ProjectForm categories={categories} project={project} />
    </div>
  );
}
