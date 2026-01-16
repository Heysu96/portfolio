import { getAllCategories } from "@/lib/queries";
import ProjectForm from "@/components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProjectPage() {
  const categories = await getAllCategories();

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
          <h1 className="text-2xl font-bold text-gray-900">새 프로젝트</h1>
          <p className="text-gray-500 mt-1">새로운 프로젝트를 추가합니다.</p>
        </div>
      </div>

      {/* Form */}
      <ProjectForm categories={categories} />
    </div>
  );
}
