"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItem =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm tracking-[-0.01em] text-[var(--text-primary)] transition-colors hover:bg-gray-50 active:bg-gray-100";

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-black/[0.06] bg-white px-4 md:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Side: Title */}
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)] md:text-lg">
            Tổng quan
          </h1>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notification Button */}
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full text-[var(--text-primary)] transition-colors hover:bg-gray-100"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <Bell className="size-[20px]" strokeWidth={1.5} aria-hidden />
            <span
              className="absolute top-2 right-2.5 size-2 rounded-full border-2 border-white bg-red-600"
              aria-hidden
            />
          </button>

          {/* User Menu */}
          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              id={`${menuId}-trigger`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? `${menuId}-menu` : undefined}
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                "flex items-center gap-2 rounded-full border border-black/[0.08] p-1 pr-3 transition-all hover:bg-gray-50 active:scale-[0.98]",
                menuOpen && "bg-gray-50 ring-2 ring-black/[0.03]",
              )}
            >
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-house)] text-[10px] font-bold text-white shadow-sm"
                aria-hidden
              >
                TH
              </div>
              <span className="hidden max-w-[100px] truncate text-sm font-medium tracking-tight text-[var(--text-primary)] lg:inline">
                Trần Hậu
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-gray-400 transition-transform duration-200",
                  menuOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                id={`${menuId}-menu`}
                role="menu"
                aria-labelledby={`${menuId}-trigger`}
                className="absolute top-full right-0 z-50 mt-2 min-w-[200px] origin-top-right rounded-xl border border-black/[0.08] bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-2 mb-1 lg:hidden border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tài khoản
                  </p>
                  <p className="text-sm font-medium truncate">Trần Hậu</p>
                </div>

                <Link
                  href="#"
                  role="menuitem"
                  className={menuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="size-4 shrink-0 opacity-60" aria-hidden />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="#"
                  role="menuitem"
                  className={menuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings
                    className="size-4 shrink-0 opacity-60"
                    aria-hidden
                  />
                  Cài đặt hệ thống
                </Link>

                <div className="my-1.5 h-px bg-black/[0.04]" role="separator" />

                <button
                  type="button"
                  role="menuitem"
                  className={cn(
                    menuItem,
                    "text-red-600 hover:bg-red-50 hover:text-red-700",
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  <LogOut className="size-4 shrink-0" aria-hidden />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
