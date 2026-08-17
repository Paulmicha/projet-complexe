import { afterEach, expect, test } from "vitest";
import { render } from "@solidjs/web";
import { Cover } from "./cover";

let dispose: () => void = () => {};

afterEach(() => {
  dispose();
  document.body.innerHTML = "";
});

test("min-block-size matches minHeight", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Cover minHeight="200px">
        <h1>title</h1>
      </Cover>
    ),
    host,
  );
  const cover = host.querySelector(".cover") as HTMLElement;
  expect(getComputedStyle(cover).getPropertyValue("--cover-min-height").trim()).toBe(
    "200px",
  );
  expect(getComputedStyle(cover).minBlockSize).toMatch(/200px|cover-min-height/);
});

test("h1 child has margin-block auto by default", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Cover>
        <h1>title</h1>
      </Cover>
    ),
    host,
  );
  const heading = host.querySelector("h1") as HTMLElement;
  expect(heading.classList.contains("cover-principal")).toBe(true);
  const principalRule = [...document.styleSheets]
    .flatMap((sheet) => [...(sheet as CSSStyleSheet).cssRules])
    .find(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule &&
        rule.selectorText === ".cover > .cover-principal",
    );
  expect(principalRule?.cssText).toMatch(/margin-block:\s*auto/);
});

test("noPad removes padding", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Cover noPad space="8px">
        <h1>title</h1>
      </Cover>
    ),
    host,
  );
  const cover = host.querySelector(".cover") as HTMLElement;
  expect(cover.classList.contains("cover--no-pad")).toBe(true);
  expect(["0", "0px"]).toContain(getComputedStyle(cover).paddingTop);
  expect(["0", "0px"]).toContain(getComputedStyle(cover).paddingRight);
  expect(["0", "0px"]).toContain(getComputedStyle(cover).paddingBottom);
  expect(["0", "0px"]).toContain(getComputedStyle(cover).paddingLeft);
});
