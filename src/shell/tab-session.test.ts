import { expect, test } from "vitest";
import { createRoot } from "solid-js";
import { createTabSession, TABS_KEY } from "./tab-session";

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

test("starts with Goal 1", () => {
  createRoot((dispose) => {
    const s = createTabSession({ storage: fakeStorage() });
    expect(s.tabs()).toEqual([
      { id: "1", title: "Goal 1", state: { note: "dummy:Goal 1" } },
    ]);
    expect(s.activeId()).toBe("1");
    dispose();
  });
});

test("add appends Goal N and activates it", () => {
  createRoot((dispose) => {
    const s = createTabSession({ storage: fakeStorage() });
    s.add();
    expect(s.tabs().map((t) => t.title)).toEqual(["Goal 1", "Goal 2"]);
    expect(s.activeId()).toBe("2");
    dispose();
  });
});

test("close is a no-op on the last tab", () => {
  createRoot((dispose) => {
    const s = createTabSession({ storage: fakeStorage() });
    s.close("1");
    expect(s.tabs()).toHaveLength(1);
    expect(s.activeId()).toBe("1");
    dispose();
  });
});

test("close of the active tab activates the left neighbour", () => {
  createRoot((dispose) => {
    const s = createTabSession({ storage: fakeStorage() });
    s.add();
    s.add();
    s.setActiveId("3");
    s.close("3");
    expect(s.tabs().map((t) => t.id)).toEqual(["1", "2"]);
    expect(s.activeId()).toBe("2");
    dispose();
  });
});

test("add includes dummy state note", () => {
  createRoot((dispose) => {
    const s = createTabSession({ storage: fakeStorage() });
    s.add();
    expect(s.tabs()[1]).toEqual({
      id: "2",
      title: "Goal 2",
      state: { note: "dummy:Goal 2" },
    });
    dispose();
  });
});

test("second session hydrates tabs and activeId", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    const a = createTabSession({ storage });
    a.add();
    a.add();
    a.setActiveId("2");
    const b = createTabSession({ storage });
    expect(b.tabs().map((t) => t.id)).toEqual(["1", "2", "3"]);
    expect(b.activeId()).toBe("2");
    expect(b.tabs()[2].state.note).toBe("dummy:Goal 3");
    dispose();
  });
});

test("corrupt snapshot falls back to Goal 1", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    storage.setItem(TABS_KEY, "{bad");
    const s = createTabSession({ storage });
    expect(s.tabs()).toEqual([
      { id: "1", title: "Goal 1", state: { note: "dummy:Goal 1" } },
    ]);
    expect(s.activeId()).toBe("1");
    dispose();
  });
});

test("seq continues after restore so ids do not collide", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    const a = createTabSession({ storage });
    a.add(); // Goal 2
    a.close("1"); // left with Goal 2 only, seq still 2
    const b = createTabSession({ storage });
    b.add();
    expect(b.tabs().map((t) => t.id)).toEqual(["2", "3"]);
    expect(b.tabs()[1].title).toBe("Goal 3");
    dispose();
  });
});

test("invalid activeId rejects snapshot", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    storage.setItem(
      TABS_KEY,
      JSON.stringify({
        v: 1,
        tabs: [{ id: "1", title: "Goal 1", state: { note: "dummy:Goal 1" } }],
        activeId: "999",
        seq: 1,
      }),
    );
    const s = createTabSession({ storage });
    expect(s.activeId()).toBe("1");
    expect(s.tabs()).toHaveLength(1);
    dispose();
  });
});

test("duplicate tab ids reject snapshot", () => {
  createRoot((dispose) => {
    const storage = fakeStorage();
    storage.setItem(
      TABS_KEY,
      JSON.stringify({
        v: 1,
        tabs: [
          { id: "1", title: "Goal 1", state: { note: "dummy:Goal 1" } },
          { id: "1", title: "Goal 2", state: { note: "dummy:Goal 2" } },
        ],
        activeId: "1",
        seq: 2,
      }),
    );
    const s = createTabSession({ storage });
    expect(s.tabs()).toEqual([
      { id: "1", title: "Goal 1", state: { note: "dummy:Goal 1" } },
    ]);
    expect(s.activeId()).toBe("1");
    dispose();
  });
});
