import { expect, test } from "vitest";
import { createRoot } from "solid-js";
import { createThemePref, PREFERENCES_KEY } from "./theme-pref";

function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

test("defaults to light and writes preferences", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    const root = document.createElement("html");
    const p = createThemePref({ storage, root });
    expect(p.theme()).toBe("light");
    expect(root.dataset.theme).toBe("light");
    expect(JSON.parse(storage.getItem(PREFERENCES_KEY)!)).toEqual({
      theme: "light",
    });
    dispose();
  });
});

test("hydrates dark from storage", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    storage.setItem(PREFERENCES_KEY, JSON.stringify({ theme: "dark" }));
    const root = document.createElement("html");
    const p = createThemePref({ storage, root });
    expect(p.theme()).toBe("dark");
    expect(root.dataset.theme).toBe("dark");
    dispose();
  });
});

test("corrupt preferences fall back to light", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    storage.setItem(PREFERENCES_KEY, "{bad");
    const root = document.createElement("html");
    const p = createThemePref({ storage, root });
    expect(p.theme()).toBe("light");
    dispose();
  });
});

test("JSON null preferences fall back to light", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    storage.setItem(PREFERENCES_KEY, "null");
    const root = document.createElement("html");
    const p = createThemePref({ storage, root });
    expect(p.theme()).toBe("light");
    dispose();
  });
});

test("toggle flips and persists", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    const root = document.createElement("html");
    const p = createThemePref({ storage, root });
    p.toggle();
    expect(p.theme()).toBe("dark");
    expect(JSON.parse(storage.getItem(PREFERENCES_KEY)!).theme).toBe("dark");
    p.toggle();
    expect(p.theme()).toBe("light");
    dispose();
  });
});
