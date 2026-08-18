import { createEffect, createSignal, flush } from "solid-js";
import { readJson, writeJson } from "../lib/storage";

export type TabState = { note: string };

export type Tab = {
  id: string;
  title: string;
  state: TabState;
};

export type TabSession = {
  tabs: () => Tab[];
  activeId: () => string;
  setActiveId: (id: string) => void;
  add: () => void;
  close: (id: string) => void;
};

export type TabSessionOptions = {
  storage?: Storage;
};

export const TABS_KEY = "pc.tabs.v1";

export type TabSnapshot = {
  v: 1;
  tabs: Tab[];
  activeId: string;
  seq: number;
};

function defaultTab(): Tab {
  return { id: "1", title: "Goal 1", state: { note: "dummy:Goal 1" } };
}

function isTab(value: unknown): value is Tab {
  if (value == null || typeof value !== "object") return false;
  const t = value as Record<string, unknown>;
  if (typeof t.id !== "string" || typeof t.title !== "string") return false;
  if (t.state == null || typeof t.state !== "object") return false;
  const state = t.state as Record<string, unknown>;
  return typeof state.note === "string";
}

function parseSnapshot(raw: unknown): TabSnapshot | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (!Array.isArray(o.tabs) || o.tabs.length < 1) return null;
  if (!o.tabs.every(isTab)) return null;
  const ids = o.tabs.map((t) => (t as Tab).id);
  if (new Set(ids).size !== ids.length) return null;
  if (typeof o.activeId !== "string") return null;
  if (!o.tabs.some((t) => (t as Tab).id === o.activeId)) return null;
  if (typeof o.seq !== "number" || !Number.isFinite(o.seq)) return null;
  const maxId = Math.max(
    ...o.tabs.map((t) => {
      const n = Number((t as Tab).id);
      return Number.isFinite(n) ? n : NaN;
    }),
  );
  if (!Number.isFinite(maxId) || o.seq < maxId) return null;
  return {
    v: 1,
    tabs: o.tabs as Tab[],
    activeId: o.activeId,
    seq: o.seq,
  };
}

export function createTabSession(options?: TabSessionOptions): TabSession {
  const storage = options?.storage ?? localStorage;
  const parsed = parseSnapshot(readJson(storage, TABS_KEY, null));

  let seq = parsed?.seq ?? 1;
  const [tabs, setTabs] = createSignal<Tab[]>(parsed?.tabs ?? [defaultTab()], {
    ownedWrite: true,
  });
  const [activeId, setActiveIdSignal] = createSignal(parsed?.activeId ?? "1", {
    ownedWrite: true,
  });

  const setActiveId = (id: string) => {
    setActiveIdSignal(id);
    flush();
  };

  const add = () => {
    seq += 1;
    const id = String(seq);
    const next: Tab = {
      id,
      title: `Goal ${seq}`,
      state: { note: `dummy:Goal ${seq}` },
    };
    setTabs((list) => [...list, next]);
    setActiveId(id);
    flush();
  };

  const close = (id: string) => {
    const list = tabs();
    if (list.length <= 1) return;
    const index = list.findIndex((t) => t.id === id);
    if (index < 0) return;
    const remaining = list.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeId() === id) {
      const neighbour = remaining[Math.max(0, index - 1)];
      setActiveId(neighbour.id);
    }
    flush();
  };

  createEffect(
    () =>
      ({
        v: 1,
        tabs: tabs(),
        activeId: activeId(),
        seq,
      }) satisfies TabSnapshot,
    (snapshot) => {
      writeJson(storage, TABS_KEY, snapshot);
    },
  );

  flush();

  return { tabs, activeId, setActiveId, add, close };
}
