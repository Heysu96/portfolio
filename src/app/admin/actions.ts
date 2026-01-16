"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ============================================
// Project Actions
// ============================================

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const categoryIds = formData.getAll("categories") as string[];
  const isPublished = formData.get("is_published") === "true";

  // Get max sort_order
  const { data: maxOrder } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sortOrder = (maxOrder?.sort_order ?? 0) + 1;

  // Insert project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      title,
      description,
      date,
      thumbnail,
      tags,
      is_published: isPublished,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (projectError) {
    console.error("Error creating project:", projectError);
    throw new Error("프로젝트 생성에 실패했습니다.");
  }

  // Insert project_categories
  if (categoryIds.length > 0) {
    const projectCategories = categoryIds.map((categoryId) => ({
      project_id: project.id,
      category_id: categoryId,
    }));

    const { error: pcError } = await supabase
      .from("project_categories")
      .insert(projectCategories);

    if (pcError) {
      console.error("Error creating project categories:", pcError);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/works");
  revalidatePath("/");

  return project;
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const categoryIds = formData.getAll("categories") as string[];
  const isPublished = formData.get("is_published") === "true";

  // Update project
  const { error: projectError } = await supabase
    .from("projects")
    .update({
      title,
      description,
      date,
      thumbnail,
      tags,
      is_published: isPublished,
    })
    .eq("id", id);

  if (projectError) {
    console.error("Error updating project:", projectError);
    throw new Error("프로젝트 수정에 실패했습니다.");
  }

  // Update categories: delete existing and insert new
  await supabase.from("project_categories").delete().eq("project_id", id);

  if (categoryIds.length > 0) {
    const projectCategories = categoryIds.map((categoryId) => ({
      project_id: id,
      category_id: categoryId,
    }));

    const { error: pcError } = await supabase
      .from("project_categories")
      .insert(projectCategories);

    if (pcError) {
      console.error("Error updating project categories:", pcError);
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/works");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  // Delete project (cascade will delete project_categories and media)
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error("프로젝트 삭제에 실패했습니다.");
  }

  revalidatePath("/admin");
  revalidatePath("/works");
  revalidatePath("/");
}

export async function toggleProjectPublished(id: string) {
  const supabase = await createClient();

  // Get current status
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("is_published")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching project:", fetchError);
    throw new Error("프로젝트를 찾을 수 없습니다.");
  }

  // Toggle status
  const { error } = await supabase
    .from("projects")
    .update({ is_published: !project.is_published })
    .eq("id", id);

  if (error) {
    console.error("Error toggling published status:", error);
    throw new Error("상태 변경에 실패했습니다.");
  }

  revalidatePath("/admin");
  revalidatePath("/works");
  revalidatePath("/");
}

export async function reorderProjects(orderedIds: string[]) {
  const supabase = await createClient();

  // Update sort_order for each project
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("projects")
      .update({ sort_order: orderedIds.length - index })
      .eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath("/admin");
  revalidatePath("/works");
  revalidatePath("/");
}

// ============================================
// Category Actions
// ============================================

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const key = formData.get("key") as string;
  const label = formData.get("label") as string;

  // Get max sort_order
  const { data: maxOrder } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sortOrder = (maxOrder?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("categories").insert({
    key,
    label,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("카테고리 생성에 실패했습니다.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/projects/new");
  revalidatePath("/works");
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();

  const key = formData.get("key") as string;
  const label = formData.get("label") as string;

  const { error } = await supabase
    .from("categories")
    .update({ key, label })
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    throw new Error("카테고리 수정에 실패했습니다.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/works");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("카테고리 삭제에 실패했습니다.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/works");
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("categories")
      .update({ sort_order: index + 1 })
      .eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath("/admin/categories");
  revalidatePath("/works");
}

// ============================================
// Media Actions
// ============================================

export async function addMedia(
  projectId: string,
  media: { type: "image" | "video"; src: string; alt?: string }
) {
  const supabase = await createClient();

  // Get max sort_order for this project
  const { data: maxOrder } = await supabase
    .from("media")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sortOrder = (maxOrder?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("media").insert({
    project_id: projectId,
    type: media.type,
    src: media.src,
    alt: media.alt || null,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("Error adding media:", error);
    throw new Error("미디어 추가에 실패했습니다.");
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/works");
}

export async function deleteMedia(mediaId: string) {
  const supabase = await createClient();

  // Get project_id before deleting for revalidation
  const { data: media } = await supabase
    .from("media")
    .select("project_id")
    .eq("id", mediaId)
    .single();

  const { error } = await supabase.from("media").delete().eq("id", mediaId);

  if (error) {
    console.error("Error deleting media:", error);
    throw new Error("미디어 삭제에 실패했습니다.");
  }

  if (media) {
    revalidatePath(`/admin/projects/${media.project_id}`);
  }
  revalidatePath("/works");
}

export async function reorderMedia(projectId: string, orderedIds: string[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("media")
      .update({ sort_order: index + 1 })
      .eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/works");
}

// ============================================
// Image Upload
// ============================================

export async function uploadImage(formData: FormData): Promise<string> {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("파일이 없습니다.");
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `projects/${fileName}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-images").getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteImage(path: string) {
  const supabase = await createClient();

  // Extract file path from URL
  const url = new URL(path);
  const filePath = url.pathname.split("/project-images/")[1];

  if (!filePath) {
    throw new Error("잘못된 이미지 경로입니다.");
  }

  const { error } = await supabase.storage
    .from("project-images")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
    throw new Error("이미지 삭제에 실패했습니다.");
  }
}
