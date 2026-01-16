import { getAllCategories } from "@/lib/queries";
import CategoryList from "@/components/admin/CategoryList";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">카테고리 관리</h1>
        <p className="text-gray-500 mt-1">
          프로젝트 카테고리를 추가하고 관리합니다.
        </p>
      </div>

      {/* Category List */}
      <CategoryList categories={categories} />
    </div>
  );
}
