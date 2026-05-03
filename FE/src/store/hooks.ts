import * as React from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import {
  type AppTheme,
  setTheme,
  toggleTheme,
} from "./slices/theme-slice";
import type { AppDispatch, AppStore, RootState } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

export type { AppTheme };

/** Theme app-wide (Redux + localStorage qua ThemePersistence). */
export function useAppTheme() {
  const theme = useAppSelector((s) => s.theme.theme);
  const dispatch = useAppDispatch();
  const set = React.useCallback(
    (next: AppTheme) => dispatch(setTheme(next)),
    [dispatch],
  );
  const toggle = React.useCallback(() => dispatch(toggleTheme()), [dispatch]);
  return { theme, setTheme: set, toggleTheme: toggle };
}
