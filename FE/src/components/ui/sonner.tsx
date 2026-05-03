"use client";

import * as React from "react";
import {
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useAppTheme } from "@/store/hooks";

export function AppToaster({ ...props }: ToasterProps) {
  const { theme } = useAppTheme();

  return (
    <Sonner
      theme={theme}
      closeButton
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4" aria-hidden />,
        info: <Info className="size-4" aria-hidden />,
        warning: <TriangleAlert className="size-4" aria-hidden />,
        error: <XCircle className="size-4" aria-hidden />,
        loading: <Loader2 className="size-4 animate-spin" aria-hidden />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "0",
          "--toast-close-button-transform": "translate(35%, -35%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
