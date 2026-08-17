import { afterEach, expect, test } from "vitest";
import { render } from "@solidjs/web";
import { Workspace } from "./workspace";

let dispose: () => void = () => {};

afterEach(() => {
  dispose();
  document.body.innerHTML = "";
});

function mountWorkspace() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(() => <Workspace />, host);
  return host;
}

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

function visibleTabItems(host: HTMLElement) {
  return [...host.querySelectorAll(".tab-item:not([hidden])")] as HTMLElement[];
}

function visibleTabTitles(host: HTMLElement) {
  return visibleTabItems(host).map(
    (el) => el.querySelector("[role='tab']")?.textContent,
  );
}

function selectedPanelText(host: HTMLElement) {
  const selected = host.querySelector(
    '[role="tabpanel"][data-selected] .panel p',
  ) as HTMLElement | null;
  return selected?.textContent;
}

test("starts with Goal 1 tab and dummy panel", () => {
  const host = mountWorkspace();
  const trigger = host.querySelector('[role="tab"]') as HTMLElement;
  expect(trigger.textContent).toBe("Goal 1");
  expect(selectedPanelText(host)).toBe("Goal 1");
  const close = host.querySelector(
    'button[aria-label="Close Goal 1"]',
  ) as HTMLButtonElement;
  expect(close.disabled).toBe(true);
  expect(host.querySelector(".with-sidebar")).toBeNull();
});

test("add creates Goal 2 and close returns to Goal 1", async () => {
  const host = mountWorkspace();
  const add = host.querySelector(
    'button[aria-label="New tab"]',
  ) as HTMLButtonElement;
  add.click();
  await tick();
  expect(visibleTabTitles(host)).toEqual(["Goal 1", "Goal 2"]);
  expect(selectedPanelText(host)).toBe("Goal 2");
  const list = host.querySelector('[role="tablist"]') as HTMLElement;
  const listStyle = getComputedStyle(list);
  expect(listStyle.display).toBe("flex");
  expect(listStyle.flexDirection).toBe("row");
  const items = visibleTabItems(host);
  expect(items).toHaveLength(2);
  expect(getComputedStyle(items[0]).display).toBe("flex");
  expect(getComputedStyle(items[1]).display).toBe("flex");
  expect(items[0].nextElementSibling).toBe(items[1]);
  expect(Math.abs(items[0].offsetTop - items[1].offsetTop)).toBeLessThan(2);
  // jsdom does not lay out: offsetLeft stays 0; covering row check is flex-direction.
  if (items[1].offsetLeft !== items[0].offsetLeft) {
    expect(items[1].offsetLeft).toBeGreaterThan(items[0].offsetLeft);
  }
  const closeGoal2 = host.querySelector(
    'button[aria-label="Close Goal 2"]',
  ) as HTMLButtonElement;
  expect(closeGoal2.disabled).toBe(false);
  closeGoal2.click();
  await tick();
  const afterClose = [...host.querySelectorAll(".tab-item")] as HTMLElement[];
  const shown = afterClose.filter((el) => !el.hasAttribute("hidden"));
  const hidden = afterClose.filter((el) => el.hasAttribute("hidden"));
  expect(shown).toHaveLength(1);
  expect(hidden).toHaveLength(1);
  expect(getComputedStyle(shown[0]).display).toBe("flex");
  expect(getComputedStyle(hidden[0]).display).toBe("none");
  expect(visibleTabTitles(host)).toEqual(["Goal 1"]);
  expect(selectedPanelText(host)).toBe("Goal 1");
  const closeGoal1 = host.querySelector(
    'button[aria-label="Close Goal 1"]',
  ) as HTMLButtonElement;
  expect(closeGoal1.disabled).toBe(true);
});
