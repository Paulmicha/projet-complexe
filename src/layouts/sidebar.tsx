import { children } from "solid-js";
import type { JSX } from "@solidjs/web";
import "./sidebar.css";

export function Sidebar(props: {
  side?: "left" | "right";
  sideWidth?: string;
  contentMin?: string;
  space?: string;
  noStretch?: boolean;
  children?: JSX.Element;
}) {
  const resolved = children(() => props.children);

  return (
    <div
      class={[
        "with-sidebar",
        { "with-sidebar--no-stretch": !!props.noStretch },
      ]}
      style={{
        "--gutter": props.space ?? "var(--s1)",
        "--content-min": props.contentMin ?? "50%",
        ...(props.sideWidth ? { "--side-width": props.sideWidth } : {}),
      }}
    >
      {(() => {
        const sideRight = (props.side ?? "left") !== "left";
        const items = resolved.toArray();
        let index = 0;
        for (const child of items) {
          if (!(child instanceof Element)) continue;
          const isSidebar = sideRight ? index === 1 : index === 0;
          child.classList.toggle("sidebar", isSidebar);
          child.classList.toggle("not-sidebar", !isSidebar);
          index += 1;
        }
        return items;
      })()}
    </div>
  );
}
