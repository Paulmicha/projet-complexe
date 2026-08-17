import type { JSX } from "@solidjs/web";
import "./stack.css";

export function Stack(props: {
  space?: string;
  recursive?: boolean;
  splitAfter?: number;
  children?: JSX.Element;
}) {
  return (
    <div
      class={[
        "stack",
        {
          "stack--recursive": !!props.recursive,
          "stack--split-1": props.splitAfter === 1,
          "stack--split-2": props.splitAfter === 2,
          "stack--split-3": props.splitAfter === 3,
        },
      ]}
      style={{ "--layout-space": props.space ?? "var(--s1)" }}
    >
      {props.children}
    </div>
  );
}
