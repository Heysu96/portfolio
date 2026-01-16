"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, GripVertical, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderProjects, toggleProjectPublished } from "@/app/admin/actions";
import ProjectActions from "@/components/admin/ProjectActions";
import type { ProjectWithDetails, DbCategory } from "@/lib/supabase/types";

interface ProjectListProps {
  initialProjects: ProjectWithDetails[];
  categories: DbCategory[];
}

interface SortableProjectRowProps {
  project: ProjectWithDetails;
  onTogglePublished: (projectId: string) => void;
  disabled?: boolean;
}

function SortableProjectRow({ project, onTogglePublished, disabled = false }: SortableProjectRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors ${
        isDragging ? "bg-pastel-lavender/10 shadow-lg" : ""
      }`}
    >
      {/* Drag Handle */}
      <td className="px-3 py-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={`touch-none p-1 rounded ${
            disabled
              ? "cursor-not-allowed opacity-40"
              : "cursor-grab active:cursor-grabbing hover:bg-gray-100"
          }`}
          disabled={disabled}
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>
      </td>

      {/* Thumbnail */}
      <td className="px-6 py-4">
        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      </td>

      {/* Title */}
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900">{project.title}</p>
        <p className="text-sm text-gray-500 truncate max-w-xs">
          {project.description}
        </p>
      </td>

      {/* Categories */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {project.categories.map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-1 text-xs bg-pastel-lavender/20 text-pastel-lavender rounded-full"
            >
              {cat.label}
            </span>
          ))}
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-500 font-mono">{project.date}</span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        {project.is_published ? (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Eye className="w-4 h-4" />
            공개
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <EyeOff className="w-4 h-4" />
            비공개
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <ProjectActions
          projectId={project.id}
          isPublished={project.is_published}
          onToggle={onTogglePublished}
        />
      </td>
    </tr>
  );
}

export default function ProjectList({ initialProjects, categories }: ProjectListProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // 필터링된 프로젝트 계산
  const filteredProjects = selectedCategoryId === null
    ? projects
    : projects.filter((p) =>
        p.categories.some((cat) => cat.id === selectedCategoryId)
      );

  // 각 카테고리별 프로젝트 개수 계산
  const getCategoryCount = (categoryId: string) =>
    projects.filter((p) => p.categories.some((cat) => cat.id === categoryId)).length;

  const isFilterActive = selectedCategoryId !== null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(projects, oldIndex, newIndex);

    // Optimistic UI update
    setProjects(newOrder);

    try {
      await reorderProjects(newOrder.map((p) => p.id));
      router.refresh();
    } catch (error) {
      console.error("Failed to reorder projects:", error);
      // Rollback on error
      setProjects(projects);
      alert("순서 변경에 실패했습니다.");
    }
  };

  const handleTogglePublished = async (projectId: string) => {
    // 낙관적 업데이트: 즉시 UI 반영
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, is_published: !p.is_published } : p
      )
    );

    try {
      await toggleProjectPublished(projectId);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle published status:", error);
      // 실패 시 롤백
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, is_published: !p.is_published } : p
        )
      );
      alert("상태 변경에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 카테고리 필터 버튼 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {/* 전체 버튼 */}
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategoryId === null
                ? "bg-pastel-lavender text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            전체 [{projects.length}]
          </button>
          {/* 카테고리별 버튼 */}
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategoryId === cat.id
                    ? "bg-pastel-lavender text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label} [{count.toString().padStart(2, "0")}]
              </button>
            );
          })}
        </div>
        {/* 필터 적용 시 안내 메시지 */}
        {isFilterActive && (
          <p className="mt-3 text-sm text-amber-600 flex items-center gap-1">
            <span>⚠️</span> 필터 적용 중에는 순서 변경이 제한됩니다.
          </p>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredProjects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                  {/* Drag handle column */}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  썸네일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <SortableProjectRow
                  key={project.id}
                  project={project}
                  onTogglePublished={handleTogglePublished}
                  disabled={isFilterActive}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">등록된 프로젝트가 없습니다.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-pastel-lavender text-white rounded-xl hover:bg-pastel-lavender/90 transition-colors"
          >
            <Plus className="w-5 h-5" />첫 프로젝트 추가하기
          </Link>
        </div>
      )}

      {/* 필터링 결과 Empty State */}
      {projects.length > 0 && filteredProjects.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">해당 카테고리의 프로젝트가 없습니다.</p>
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="mt-4 px-4 py-2 text-pastel-lavender hover:underline"
          >
            전체 보기
          </button>
        </div>
      )}
    </div>
  );
}
