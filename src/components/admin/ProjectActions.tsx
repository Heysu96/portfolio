"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleProjectPublished, deleteProject } from "@/app/admin/actions";

interface ProjectActionsProps {
  projectId: string;
  isPublished: boolean;
  onToggle?: (projectId: string) => void;
}

export default function ProjectActions({
  projectId,
  isPublished,
  onToggle,
}: ProjectActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleTogglePublished = async () => {
    // onToggle이 있으면 부모에게 상태 업데이트 위임 (낙관적 업데이트)
    if (onToggle) {
      onToggle(projectId);
      return;
    }

    // 하위 호환성: onToggle이 없으면 기존 로직 유지
    setLoading(true);
    try {
      await toggleProjectPublished(projectId);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle published status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProject(projectId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">삭제하시겠습니까?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "확인"}
        </button>
        <button
          onClick={() => setShowDeleteConfirm(false)}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Toggle Published */}
      <button
        onClick={handleTogglePublished}
        disabled={loading}
        className={`p-2 rounded-lg transition-colors ${
          isPublished
            ? "text-green-600 hover:bg-green-50"
            : "text-gray-400 hover:bg-gray-100"
        }`}
        title={isPublished ? "비공개로 전환" : "공개로 전환"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPublished ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>

      {/* Edit */}
      <Link
        href={`/admin/projects/${projectId}`}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="수정"
      >
        <Pencil className="w-4 h-4" />
      </Link>

      {/* Delete */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="삭제"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
