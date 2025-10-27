// store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { Appearance } from "react-native";

/* ────────────────────── LIGHT THEME ────────────────────── */
const lightTheme = {
  background: "#ffffff",
  foreground: "#000000",
  card: "#ffffff",
  muted: "#f3f3f5",
  border: "#e5e5e5",
  inputBg: "#f3f3f5",
  messageIn: "#ffffff",
  messageOut: "#000000",
  messageInText: "#000000",
  messageOutText: "#ffffff",
  unreadBg: "#000000",
  unreadText: "#ffffff",
  iconRead: "#999999",
  iconUnread: "#ffffff",
  headerBg: "#ffffff",
  primary: "#000000",
  mutedForeground: "#777777",
  secondary: "#10b981",
};

/* ────────────────────── DARK THEME ────────────────────── */
const darkTheme = {
  // background: "#0d1117",
  // card: "#161b22",
  // headerBg: "#161b22",
  // foreground: "#e6edf3",
  // mutedForeground: "#8b949e",
  // border: "#30363d",
  // muted: "#21262d",
  // inputBg: "#0d1117",
  // messageIn: "#21262d",
  // messageInText: "#e6edf3",
  // messageOut: "#238636",
  // messageOutText: "#ffffff",
  // unreadBg: "#238636",
  // unreadText: "#ffffff",
  // iconRead: "#8b949e",
  // iconUnread: "#ffffff",
  // primary: "#238636",

  background: "#ffffff",
  foreground: "#000000",
  card: "#ffffff",
  muted: "#f3f3f5",
  border: "#e5e5e5",
  inputBg: "#f3f3f5",
  messageIn: "#ffffff",
  messageOut: "#000000",
  messageInText: "#000000",
  messageOutText: "#ffffff",
  unreadBg: "#000000",
  unreadText: "#ffffff",
  iconRead: "#999999",
  iconUnread: "#ffffff",
  headerBg: "#ffffff",
  primary: "#000000",
  mutedForeground: "#777777",
  secondary: "#16a34a",
};

/* ────────────────────── THEME SLICE ────────────────────── */
const system = Appearance.getColorScheme();

const initialState = {
  mode: system || "light",
  theme: system === "dark" ? darkTheme : lightTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      state.theme = state.mode === "light" ? lightTheme : darkTheme;
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      state.theme = state.mode === "dark" ? darkTheme : lightTheme;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.theme;
export const selectMode = (state) => state.theme.mode;

export default themeSlice.reducer;
