"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, GripVertical, Loader2, X, Check } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/actions";
import type { DbCategory } from "@/lib/supabase/types";

interface CategoryListProps {
  categories: DbCategory[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editKey, setEditKey] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const handleAdd = async () => {
    if (!newKey || !newLabel) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("key", newKey);
      formData.append("label", newLabel);
      await createCategory(formData);
      setNewKey("");
      setNewLabel("");
      setShowAddForm(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("카테고리 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editKey || !editLabel) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("key", editKey);
      formData.append("label", editLabel);
      await updateCategory(id, formData);
      setEditingId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("카테고리 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 카테고리를 삭제하시겠습니까? 연결된 프로젝트에서도 제거됩니다.")) {
      return;
    }

    setLoading(true);
    try {
      await deleteCategory(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("카테고리 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (cat: DbCategory) => {
    setEditingId(cat.id);
    setEditKey(cat.key);
    setEditLabel(cat.label);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditKey("");
    setEditLabel("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
              {/* Drag handle */}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              키 (key)
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              라벨 (label)
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50">
              {/* Drag Handle */}
              <td className="px-6 py-4">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
              </td>

              {editingId === cat.id ? (
                <>
                  {/* Editing Mode */}
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={editKey}
                      onChange={(e) => setEditKey(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                      placeholder="key"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                      placeholder="Label"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat.id)}
                        disabled={loading}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <td className="px-6 py-4">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {cat.key}
                    </code>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.label}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEditing(cat)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}

          {/* Add New Category Row */}
          {showAddForm && (
            <tr className="bg-pastel-lavender/5">
              <td className="px-6 py-4" />
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="key (예: web, ai-video)"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="Label (예: Web, AI Video)"
                />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={loading || !newKey || !newLabel}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewKey("");
                      setNewLabel("");
                    }}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Empty State / Add Button */}
      <div className="p-4 border-t border-gray-200">
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-pastel-lavender hover:bg-pastel-lavender/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />새 카테고리 추가
          </button>
        )}
      </div>
    </div>
  );
}
