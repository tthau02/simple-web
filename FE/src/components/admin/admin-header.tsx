"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItem =
  "flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left text-sm tracking-[-0.01em] text-[var(--text-primary)] transition-colors hover:bg-[#f9f9f9]";

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
    <header className="border-b border-black/[0.08] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:px-6 md:py-4">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            Bảng điều khiển
          </p>
          <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            Tổng quan
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            className={cn(
              "relative flex size-10 items-center justify-center rounded-[12px] text-[var(--text-primary)] transition-colors hover:bg-[#f9f9f9]",
            )}
            aria-label="Thông báo"
            title="Thông báo"
          >
            <Bell className="size-5" strokeWidth={1.75} aria-hidden />
            <span
              className="absolute top-2 right-2 size-2 rounded-full bg-[#c82014]"
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
                "flex max-w-[14rem] items-center gap-2 rounded-[50px] border border-black/[0.08] py-1.5 pr-2 pl-1.5 transition-colors hover:bg-[#f9f9f9]",
              )}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-house)] text-xs font-semibold text-white"
                aria-hidden
              >
                A
              </span>
              <span className="hidden min-w-0 truncate text-sm font-medium tracking-[-0.01em] text-[var(--text-primary)] sm:inline">
                Admin
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-[var(--text-secondary)] transition-transform",
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
                className="absolute top-full right-0 z-50 mt-2 min-w-[13rem] rounded-[12px] border border-black/[0.08] bg-white py-1.5 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.12)]"
              >
                <Link
                  href="#"
                  role="menuitem"
                  className={menuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="size-4 shrink-0 opacity-70" aria-hidden />
                  Hồ sơ
                </Link>
                <Link
                  href="#"
                  role="menuitem"
                  className={menuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings
                    className="size-4 shrink-0 opacity-70"
                    aria-hidden
                  />
                  Cài đặt tài khoản
                </Link>
                <div className="my-1 h-px bg-black/[0.06]" role="separator" />
                <button
                  type="button"
                  role="menuitem"
                  className={cn(menuItem, "text-[#c82014] hover:bg-red-50")}
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
