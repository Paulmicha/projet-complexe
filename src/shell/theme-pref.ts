import { createEffect, createSignal, flush } from "solid-js";
import { readJson, writeJson } from "../lib/storage";

export type Theme = "light" | "dark";

export type ThemePref = {
  theme: () => Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

export type ThemePrefOptions = {
  storage?: Storage;
  root?: HTMLElement;
};

export const PREFERENCES_KEY = "pc.preferences.v1";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function themeFromStored(stored: unknown): Theme {
  if (stored == null || typeof stored !== "object") return "light";
  const theme = (stored as { theme?: unknown }).theme;
  return isTheme(theme) ? theme : "light";
}

function applyTheme(root: HTMLElement, theme: Theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function createThemePref(options?: ThemePrefOptions): ThemePref {
  const storage = options?.storage ?? localStorage;
  const root = options?.root ?? document.documentElement;

  const stored = readJson<{ theme?: unknown }>(storage, PREFERENCES_KEY, {});
  const initial: Theme = themeFromStored(stored);

  const [theme, setThemeSignal] = createSignal<Theme>(initial, {
    ownedWrite: true,
  });

  const setTheme = (next: Theme) => {
    setThemeSignal(next);
    flush();
  };

  const toggle = () => {
    setThemeSignal((t) => (t === "light" ? "dark" : "light"));
    flush();
  };

  createEffect(theme, (t) => {
    writeJson(storage, PREFERENCES_KEY, { theme: t });
    applyTheme(root, t);
  });

  flush();

  return { theme, setTheme, toggle };
}
