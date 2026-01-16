"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  LogOut,
  ExternalLink,
  User,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AdminSidebarProps {
  user: SupabaseUser;
}

const navItems = [
  {
    href: "/admin",
    label: "대시보드",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/categories",
    label: "카테고리 관리",
    icon: Tags,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Portfolio Admin</h1>
        <p className="text-sm text-gray-500 mt-1">관리자 대시보드</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-pastel-lavender/20 text-pastel-lavender"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {/* View Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          사이트 보러가기
        </a>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-pastel-lavender/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-pastel-lavender" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
