"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import { useAppTheme } from "@/store/hooks";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const menuItemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm tracking-[-0.01em] text-foreground transition-colors hover:bg-muted active:bg-muted/80";

function AdminThemeToggle() {
  const { theme, setTheme } = useAppTheme();
  const dark = theme === "dark";

  return (
    <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1 pl-2.5">
      <Sun
        className="size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden
      />
      <Switch
        checked={dark}
        onCheckedChange={(on) => setTheme(on ? "dark" : "light")}
        size="sm"
        aria-label={dark ? "Đang dùng giao diện tối" : "Đang dùng giao diện sáng"}
      />
      <Moon
        className="size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function handlePointer(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center border-b border-border bg-card px-4 md:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
            Tổng quan
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <AdminThemeToggle />

          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <Bell className="size-[20px]" strokeWidth={1.5} aria-hidden />
            <span
              className="absolute top-2 right-2.5 size-2 rounded-full border-2 border-card bg-destructive"
              aria-hidden
            />
          </button>

          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              id={`${menuId}-trigger`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? `${menuId}-menu` : undefined}
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                "flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 transition-all hover:bg-muted active:scale-[0.98]",
                menuOpen && "bg-muted ring-2 ring-ring/30",
              )}
            >
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-house text-[10px] font-bold text-(--text-on-dark) shadow-sm"
                aria-hidden
              >
                TH
              </div>
              <span className="hidden max-w-[100px] truncate text-sm font-medium tracking-tight text-foreground lg:inline">
                Trần Hậu
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                  menuOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {menuOpen ? (
              <div
                id={`${menuId}-menu`}
                role="menu"
                aria-labelledby={`${menuId}-trigger`}
                className="absolute top-full right-0 z-50 mt-2 min-w-[200px] origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg animate-in fade-in zoom-in-95 duration-100 dark:shadow-black/40"
              >
                <div className="mb-1 border-b border-border px-3 py-2 lg:hidden">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Tài khoản
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    Trần Hậu
                  </p>
                </div>

                <Link
                  href="#"
                  role="menuitem"
                  className={menuItemClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="size-4 shrink-0 opacity-70" aria-hidden />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="#"
                  role="menuitem"
                  className={menuItemClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings
                    className="size-4 shrink-0 opacity-70"
                    aria-hidden
                  />
                  Cài đặt hệ thống
                </Link>

                <div className="my-1.5 h-px bg-border" role="separator" />

                <button
                  type="button"
                  role="menuitem"
                  className={cn(
                    menuItemClass,
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  <LogOut className="size-4 shrink-0" aria-hidden />
                  Đăng xuất
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
