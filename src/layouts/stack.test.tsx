import { afterEach, expect, test } from "vitest";
import { render } from "@solidjs/web";
import { Stack } from "./stack";

let dispose: () => void = () => {};

afterEach(() => {
  dispose();
  document.body.innerHTML = "";
});

test("stack applies margin-block-start only to the second child", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Stack space="8px">
        <p data-a>a</p>
        <p data-b>b</p>
      </Stack>
    ),
    host,
  );
  const stack = host.querySelector(".stack") as HTMLElement;
  const a = host.querySelector("[data-a]") as HTMLElement;
  const b = host.querySelector("[data-b]") as HTMLElement;
  expect(getComputedStyle(stack).display).toBe("flex");
  expect(getComputedStyle(stack).getPropertyValue("--layout-space").trim()).toBe(
    "8px",
  );
  expect(
    getComputedStyle(a).getPropertyValue("--space").replace(/\s+/g, ""),
  ).toBe("var(--layout-space,var(--s1))");
  expect(["0", "0px"]).toContain(getComputedStyle(a).marginBlockStart);
  expect(getComputedStyle(b).marginBlockStart).toBe("var(--space, 1.5rem)"); // jsdom does not resolve var() used values
});
