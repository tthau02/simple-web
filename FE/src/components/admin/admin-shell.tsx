"use client";

import * as React from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAppTheme } from "@/store/hooks";
import { cn } from "@/lib/utils";

function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();

  /**
   * Drawer / Popover / Select portal vào `document.body`, ngoài cây DOM của shell.
   * Gắn `dark` lên `document.documentElement` để token `--card`, `--popover`, … áp dụng cho mọi portal.
   */
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    return () => root.classList.remove("dark");
  }, [theme]);

  return (
    <div
      data-app-shell="admin"
      className={cn(
        "flex min-h-full min-w-0 flex-1 flex-col bg-neutral-cool text-foreground md:flex-row",
      )}
    >
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-cool">
        <AdminHeader />
        <div className="flex-1 overflow-auto p-3 md:p-4">{children}</div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <AdminShellLayout>{children}</AdminShellLayout>;
}
