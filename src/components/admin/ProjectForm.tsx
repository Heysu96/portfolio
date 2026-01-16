"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
  Video,
  Trash2,
  GripVertical,
} from "lucide-react";
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
import { createProject, updateProject, uploadImage, addMedia, deleteMedia, reorderMedia } from "@/app/admin/actions";
import type { DbCategory, DbMedia, ProjectWithDetails } from "@/lib/supabase/types";

interface ProjectFormProps {
  categories: DbCategory[];
  project?: ProjectWithDetails;
}

interface SortableMediaItemProps {
  item: DbMedia;
  onDelete: (id: string) => void;
}

function SortableMediaItem({ item, onDelete }: SortableMediaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </button>
      {item.type === "image" ? (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <Image src={item.src} alt={item.alt || ""} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-16 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
          <Video className="w-6 h-6 text-gray-500" />
        </div>
      )}
      <span className="truncate max-w-xs text-sm text-gray-600">{item.src}</span>
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProjectForm({ categories, project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(project?.thumbnail || "");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [newMediaSrc, setNewMediaSrc] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!project;

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData);
      setThumbnailPreview(url);
    } catch (error) {
      console.error("Failed to upload thumbnail:", error);
      alert("썸네일 업로드에 실패했습니다.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleMediaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !project) return;

    setUploadingMedia(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const url = await uploadImage(formData);
        await addMedia(project.id, { type: "image", src: url });
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to upload media:", error);
      alert("미디어 업로드에 실패했습니다.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleAddVideoMedia = async () => {
    if (!newMediaSrc || !project) return;

    setUploadingMedia(true);
    try {
      await addMedia(project.id, { type: "video", src: newMediaSrc });
      setNewMediaSrc("");
      router.refresh();
    } catch (error) {
      console.error("Failed to add video:", error);
      alert("비디오 추가에 실패했습니다.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("미디어를 삭제하시겠습니까?")) return;

    try {
      await deleteMedia(mediaId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete media:", error);
      alert("미디어 삭제에 실패했습니다.");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !project || active.id === over.id) return;

    const oldIndex = project.media.findIndex((m) => m.id === active.id);
    const newIndex = project.media.findIndex((m) => m.id === over.id);
    const newOrder = arrayMove(project.media, oldIndex, newIndex);

    try {
      await reorderMedia(project.id, newOrder.map((m) => m.id));
      router.refresh();
    } catch (error) {
      console.error("Failed to reorder media:", error);
      alert("미디어 순서 변경에 실패했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("thumbnail", thumbnailPreview);

      if (isEditing) {
        await updateProject(project.id, formData);
        router.push("/admin");
      } else {
        await createProject(formData);
        router.push("/admin");
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>

        <div className="grid gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={project?.title}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent"
              placeholder="프로젝트 제목"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              defaultValue={project?.description}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent resize-none"
              placeholder="프로젝트 설명"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="date"
              defaultValue={project?.date}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent"
              placeholder="2025.12"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 (콤마로 구분)
            </label>
            <input
              type="text"
              name="tags"
              defaultValue={project?.tags.join(", ")}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent"
              placeholder="Photoshop, AI, Web"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:bg-pastel-lavender/10 has-[:checked]:border-pastel-lavender"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={cat.id}
                    defaultChecked={project?.categories.some((c) => c.id === cat.id)}
                    className="w-4 h-4 accent-pastel-lavender"
                  />
                  <span className="text-sm text-gray-700">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Published */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                value="true"
                defaultChecked={project?.is_published ?? true}
                className="w-5 h-5 accent-pastel-lavender"
              />
              <span className="text-sm font-medium text-gray-700">공개</span>
            </label>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">썸네일</h2>

        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="relative w-48 h-36 bg-gray-100 rounded-xl overflow-hidden">
            {thumbnailPreview ? (
              <>
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setThumbnailPreview("")}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <input
              type="hidden"
              name="thumbnail"
              value={thumbnailPreview}
              required
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingThumbnail}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              {uploadingThumbnail ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              이미지 업로드
            </button>
            <p className="text-sm text-gray-500 mt-2">
              또는 이미지 URL 직접 입력:
            </p>
            <input
              type="text"
              value={thumbnailPreview}
              onChange={(e) => setThumbnailPreview(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
              placeholder="/project01/01.png 또는 https://..."
            />
          </div>
        </div>
      </div>

      {/* Media (Only in edit mode) */}
      {isEditing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">미디어</h2>

          {/* Media List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={project.media.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 mb-6">
                {project.media.map((item) => (
                  <SortableMediaItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteMedia}
                  />
                ))}
                {project.media.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    등록된 미디어가 없습니다.
                  </p>
                )}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Media */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">미디어 추가</h3>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setNewMediaType("image")}
                className={`px-4 py-2 text-sm rounded-lg ${newMediaType === "image"
                  ? "bg-pastel-lavender text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-2" />
                이미지
              </button>
              <button
                type="button"
                onClick={() => setNewMediaType("video")}
                className={`px-4 py-2 text-sm rounded-lg ${newMediaType === "video"
                  ? "bg-pastel-lavender text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Video className="w-4 h-4 inline mr-2" />
                비디오
              </button>
            </div>

            {newMediaType === "image" ? (
              <div>
                <input
                  ref={mediaFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  disabled={uploadingMedia}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingMedia ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  이미지 업로드
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMediaSrc}
                  onChange={(e) => setNewMediaSrc(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
                  placeholder="비디오 URL (Google Drive, YouTube 등)"
                />
                <button
                  type="button"
                  onClick={handleAddVideoMedia}
                  disabled={!newMediaSrc || uploadingMedia}
                  className="flex items-center gap-2 px-4 py-2 bg-pastel-lavender text-white rounded-xl hover:bg-pastel-lavender/90 disabled:opacity-50"
                >
                  {uploadingMedia ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  추가
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading || !thumbnailPreview}
          className="flex items-center gap-2 px-6 py-3 bg-pastel-lavender text-white rounded-xl hover:scale-105 hover:text-black disabled:opacity-50 cursor-pointer"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {isEditing ? "저장" : "생성"}
        </button>
      </div>
    </form>
  );
}
