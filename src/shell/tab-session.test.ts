import { expect, test } from "vitest";
import { createRoot } from "solid-js";
import { createTabSession } from "./tab-session";

test("starts with Goal 1", () => {
  createRoot((dispose) => {
    const s = createTabSession();
    expect(s.tabs()).toEqual([{ id: "1", title: "Goal 1" }]);
    expect(s.activeId()).toBe("1");
    dispose();
  });
});

test("add appends Goal N and activates it", () => {
  createRoot((dispose) => {
    const s = createTabSession();
    s.add();
    expect(s.tabs().map((t) => t.title)).toEqual(["Goal 1", "Goal 2"]);
    expect(s.activeId()).toBe("2");
    dispose();
  });
});

test("close is a no-op on the last tab", () => {
  createRoot((dispose) => {
    const s = createTabSession();
    s.close("1");
    expect(s.tabs()).toHaveLength(1);
    expect(s.activeId()).toBe("1");
    dispose();
  });
});

test("close of the active tab activates the left neighbour", () => {
  createRoot((dispose) => {
    const s = createTabSession();
    s.add();
    s.add();
    s.setActiveId("3");
    s.close("3");
    expect(s.tabs().map((t) => t.id)).toEqual(["1", "2"]);
    expect(s.activeId()).toBe("2");
    dispose();
  });
});
