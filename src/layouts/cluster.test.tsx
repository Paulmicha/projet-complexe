import { afterEach, expect, test } from "vitest";
import { render } from "@solidjs/web";
import { Cluster } from "./cluster";

let dispose: () => void = () => {};

afterEach(() => {
  dispose();
  document.body.innerHTML = "";
});

test("cluster is a wrapping flex row with flex-start defaults", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(
    () => (
      <Cluster>
        <span>a</span>
        <span>b</span>
      </Cluster>
    ),
    host,
  );
  const cluster = host.querySelector(".cluster") as HTMLElement;
  const style = getComputedStyle(cluster);
  expect(style.display).toBe("flex");
  expect(style.flexWrap).toBe("wrap");
  expect(style.getPropertyValue("--justify").trim()).toBe("flex-start");
  expect(style.getPropertyValue("--align").trim()).toBe("flex-start");
  expect(style.justifyContent).toMatch(/flex-start/);
  expect(style.alignItems).toMatch(/flex-start/);
});
