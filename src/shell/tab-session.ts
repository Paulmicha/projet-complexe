import { createSignal, flush } from "solid-js";

export type Tab = { id: string; title: string };

export type TabSession = {
  tabs: () => Tab[];
  activeId: () => string;
  setActiveId: (id: string) => void;
  add: () => void;
  close: (id: string) => void;
};

export function createTabSession(): TabSession {
  let seq = 1;
  const [tabs, setTabs] = createSignal<Tab[]>([{ id: "1", title: "Goal 1" }], {
    ownedWrite: true,
  });
  const [activeId, setActiveId] = createSignal("1", { ownedWrite: true });

  const add = () => {
    seq += 1;
    const id = String(seq);
    const next: Tab = { id, title: `Goal ${seq}` };
    setTabs((list) => [...list, next]);
    setActiveId(id);
    flush(); // Solid 2 RC: createRoot tests read the snapshot before the microtask
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
    flush(); // Solid 2 RC: createRoot tests read the snapshot before the microtask
  };

  return { tabs, activeId, setActiveId, add, close };
}
