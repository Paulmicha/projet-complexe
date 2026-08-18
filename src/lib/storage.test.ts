import { expect, test } from "vitest";
import { readJson, writeJson } from "./storage";

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

test("readJson returns fallback when missing", () => {
  const s = fakeStorage();
  expect(readJson(s, "k", { a: 1 })).toEqual({ a: 1 });
});

test("readJson returns fallback on invalid JSON", () => {
  const s = fakeStorage();
  s.setItem("k", "{not-json");
  expect(readJson(s, "k", { a: 1 })).toEqual({ a: 1 });
});

test("writeJson round-trips", () => {
  const s = fakeStorage();
  writeJson(s, "k", { theme: "dark" });
  expect(readJson(s, "k", { theme: "light" })).toEqual({ theme: "dark" });
});
