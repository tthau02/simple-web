import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Quản trị",
};

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-full min-w-0 flex-1 flex-col bg-[#f9f9f9] md:flex-row"
      data-app-shell="admin"
    >
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-auto p-3 md:p-4">{children}</div>
      </div>
    </div>
  );
}
