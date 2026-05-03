import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Giữ key cũ để không mất preference đã lưu trong admin. */
export const THEME_STORAGE_KEY = "admin-theme";

export type AppTheme = "light" | "dark";

type ThemeState = {
  theme: AppTheme;
};

const initialState: ThemeState = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    hydrateTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, hydrateTheme } = themeSlice.actions;
export default themeSlice.reducer;
