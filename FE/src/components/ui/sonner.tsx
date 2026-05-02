"use client";

import { Toaster } from "sonner";

/** Sonner Toaster — gắn một lần trong `AppProviders`; dùng `showToast` hoặc `toast` từ `sonner`. */
export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      theme="light"
      closeButton
      offset="1rem"
      toastOptions={{
        duration: 4500,
        classNames: {
          toast:
            "rounded-[12px] border border-black/[0.08] bg-white font-sans tracking-[-0.01em] shadow-[0px_0px_0.5px_0px_rgba(0,0,0,0.14),0px_8px_24px_rgba(0,0,0,0.12)]",
          title: "text-[0.95rem] font-semibold text-[var(--text-primary)]",
          description: "text-sm text-[var(--text-secondary)]",
        },
      }}
    />
  );
}
