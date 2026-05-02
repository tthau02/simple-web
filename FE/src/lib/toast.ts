import {
  toast as sonnerToast,
  type ExternalToast,
  type ToastClassnames,
} from "sonner";

import { cn } from "@/lib/utils";

export { toast } from "sonner";
export type { ExternalToast, ToastClassnames } from "sonner";

const TOAST_SURFACE = cn(
  "rounded-[12px] border border-black/[0.08] bg-white font-sans tracking-[-0.01em]",
  "shadow-[0px_0px_0.5px_0px_rgba(0,0,0,0.14),0px_8px_24px_rgba(0,0,0,0.12)]",
);

const TITLE_DEFAULT = "text-[0.95rem] font-semibold text-[var(--text-primary)]";
const DESC_DEFAULT = "text-sm text-[var(--text-secondary)]";

/** Màu preset theo DESIGN.md + vài biến tiện gọi — hoặc chuỗi class Tailwind tuỳ ý. */
const COLOR_PRESETS = {
  brand: "border-l-4 border-l-[var(--brand-cta)]",
  destructive: "border-l-4 border-l-[#c82014]",
  success: "border-l-4 border-l-[var(--brand-cta)] bg-[#d4e9e2]/25",
  warning: "border-l-4 border-l-[#fbbc05]",
  info: "border-l-4 border-l-[var(--brand-heading)]",
  neutral: "border-l-4 border-l-black/20",
} as const;

export type ToastColorPreset = keyof typeof COLOR_PRESETS;

export type AppToastType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

export type ShowToastOptions = {
  type?: AppToastType;
  title: string;
  message?: string;
  duration?: number;
  /** Preset (`brand`, `destructive`, …) hoặc class Tailwind gắn thêm lên vỏ toast. */
  color?: ToastColorPreset | (string & {});
  className?: string;
  classNames?: Partial<ToastClassnames>;
} & Pick<
  ExternalToast,
  "id" | "onDismiss" | "onAutoClose" | "action" | "cancel" | "closeButton"
>;

function resolveColorClasses(color?: string): string | undefined {
  if (!color) return undefined;
  if (Object.prototype.hasOwnProperty.call(COLOR_PRESETS, color)) {
    return COLOR_PRESETS[color as ToastColorPreset];
  }
  return color;
}

function buildExternalToast(opts: Omit<ShowToastOptions, "type" | "title">): ExternalToast {
  const {
    message,
    duration,
    color,
    className,
    classNames,
    id,
    onDismiss,
    onAutoClose,
    action,
    cancel,
    closeButton,
  } = opts;

  const {
    toast: userToast,
    title: userTitle,
    description: userDesc,
    ...extraClassNames
  } = classNames ?? {};

  return {
    id,
    description: message,
    duration,
    onDismiss,
    onAutoClose,
    action,
    cancel,
    closeButton,
    classNames: {
      ...extraClassNames,
      toast: cn(
        TOAST_SURFACE,
        resolveColorClasses(color),
        className,
        userToast,
      ),
      title: cn(TITLE_DEFAULT, userTitle),
      description: cn(DESC_DEFAULT, userDesc),
    },
  };
}

/**
 * Toast dùng chung: sonner + style DESIGN (bo 12px, shadow nhẹ).
 *
 * ```ts
 * showToast({ type: "success", title: "Xong", message: "Đã lưu.", color: "success" });
 * showToast({ type: "error", title: "Lỗi", message: "Thử lại.", color: "destructive" });
 * showToast({ title: "Tuỳ chỉnh", color: "border-l-4 border-l-violet-500" });
 * ```
 */
export function showToast(options: ShowToastOptions): string | number {
  const { type = "default", title, ...rest } = options;
  const data = buildExternalToast(rest);

  switch (type) {
    case "success":
      return sonnerToast.success(title, data);
    case "error":
      return sonnerToast.error(title, data);
    case "warning":
      return sonnerToast.warning(title, data);
    case "info":
      return sonnerToast.info(title, data);
    case "loading":
      return sonnerToast.loading(title, data);
    default:
      return sonnerToast(title, data);
  }
}

export function dismissToast(id?: string | number) {
  return sonnerToast.dismiss(id);
}
