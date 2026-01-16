import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 페이지의 경우 user가 없으므로 Sidebar 없이 렌더링
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={user} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
