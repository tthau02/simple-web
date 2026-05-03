import type { ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

import { cn } from "@/lib/utils";

export { toast, type ExternalToast, type ToastClassnames } from "sonner";

/** Accent trái (border-l) theo mã lỗi — gộp vào `classNames.toast`, không đụng layout flex của Sonner. */
export const TOAST_ERROR_CODE_ACCENTS: Record<string, string> = {
  validation: "border-l-4 border-l-amber-500",
  auth: "border-l-4 border-l-destructive",
  forbidden: "border-l-4 border-l-orange-500",
  network: "border-l-4 border-l-sky-500",
  server: "border-l-4 border-l-red-600",
  default: "",
};

type ToastErrorOptions = Omit<ExternalToast, "description"> & {
  description?: ReactNode;
};

/**

 * `toast.error` + accent màu theo `code` (không phân biệt hoa thường).

 * Tuỳ chỉnh map: `TOAST_ERROR_CODE_ACCENTS` hoặc truyền `classNames.toast` để ghi đè.

 */

export function toastErrorForCode(

  code: string,

  title: string,

  options?: ToastErrorOptions,

): ReturnType<typeof sonnerToast.error> {

  const key = code.trim().toLowerCase();

  const accent =

    TOAST_ERROR_CODE_ACCENTS[key] ?? TOAST_ERROR_CODE_ACCENTS.default;



  return sonnerToast.error(title, {

    ...options,

    classNames: {

      ...options?.classNames,

      toast: cn(accent, options?.classNames?.toast),

    },

  });

}
