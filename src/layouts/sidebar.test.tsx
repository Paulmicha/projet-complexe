import { afterEach, expect, test } from "vitest";
import { render } from "@solidjs/web";
import { Sidebar } from "./sidebar";

let dispose: () => void = () => {};

afterEach(() => {
  dispose();
  document.body.innerHTML = "";
});

test("last child flex-grow is 999 when side is left", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Sidebar>
        <div data-side>side</div>
        <div data-main>main</div>
      </Sidebar>
    ),
    host,
  );
  const side = host.querySelector("[data-side]") as HTMLElement;
  const main = host.querySelector("[data-main]") as HTMLElement;
  expect(side.classList.contains("sidebar")).toBe(true);
  expect(main.classList.contains("not-sidebar")).toBe(true);
  expect(getComputedStyle(main).flexGrow).toBe("999");
});

test("noStretch sets align-items flex-start", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Sidebar noStretch>
        <div>side</div>
        <div>main</div>
      </Sidebar>
    ),
    host,
  );
  const wrap = host.querySelector(".with-sidebar") as HTMLElement;
  expect(wrap.classList.contains("with-sidebar--no-stretch")).toBe(true);
  expect(getComputedStyle(wrap).alignItems).toBe("flex-start");
});

test("omitted sideWidth leaves sidebar flex-basis auto", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Sidebar>
        <div data-side>side</div>
        <div>main</div>
      </Sidebar>
    ),
    host,
  );
  const wrap = host.querySelector(".with-sidebar") as HTMLElement;
  const side = host.querySelector("[data-side]") as HTMLElement;
  expect(getComputedStyle(wrap).getPropertyValue("--side-width").trim()).toBe(
    "",
  );
  expect(getComputedStyle(side).flexBasis).toMatch(/auto|side-width/); // jsdom does not resolve var() used values
});
