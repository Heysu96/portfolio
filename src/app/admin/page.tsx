import Link from "next/link";
import { getAllProjects, getAllCategories } from "@/lib/queries";
import { Plus } from "lucide-react";
import ProjectList from "@/components/admin/ProjectList";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, categories] = await Promise.all([
    getAllProjects(),
    getAllCategories(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
          <p className="text-gray-500 mt-1">
            총 {projects.length}개의 프로젝트
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-pastel-lavender text-white rounded-xl hover:bg-pastel-lavender/90 transition-colors hover:scale-105 hover:text-black"
        >
          <Plus className="w-5 h-5" />새 프로젝트
        </Link>
      </div>

      {/* Projects Table with Drag and Drop */}
      <ProjectList initialProjects={projects} categories={categories} />
    </div>
  );
}
