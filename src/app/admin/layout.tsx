import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 md:flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
