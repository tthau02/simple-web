"use client";

import * as React from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateTheme,
  THEME_STORAGE_KEY,
} from "@/store/slices/theme-slice";

/**
 * Đọc/ghi theme vào localStorage.
 * Bỏ qua lần persist đầu để không ghi `light` đè lên giá trị đã lưu trước khi hydrate.
 */
export function ThemePersistence() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.theme.theme);
  const skipNextPersist = React.useRef(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        dispatch(hydrateTheme(stored));
      }
    } catch {
      /* ignore */
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return null;
}
