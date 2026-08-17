import { children } from "solid-js";
import type { JSX } from "@solidjs/web";
import "./cover.css";

export function Cover(props: {
  centered?: string;
  space?: string;
  minHeight?: string;
  noPad?: boolean;
  children?: JSX.Element;
}) {
  const resolved = children(() => props.children);

  return (
    <div
      class={["cover", { "cover--no-pad": !!props.noPad }]}
      style={{
        "--space": props.space ?? "var(--s1)",
        "--cover-min-height": props.minHeight ?? "100vh",
      }}
    >
      {resolved.toArray().map((child) => {
        if (child instanceof Element) {
          child.classList.toggle(
            "cover-principal",
            child.matches(props.centered ?? "h1"),
          );
        }
        return child;
      })}
    </div>
  );
}
