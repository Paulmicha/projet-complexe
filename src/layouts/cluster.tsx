import type { JSX } from "@solidjs/web";
import "./cluster.css";

export function Cluster(props: {
  justify?: string;
  align?: string;
  space?: string;
  children?: JSX.Element;
}) {
  return (
    <div
      class="cluster"
      style={{
        "--space": props.space ?? "var(--s1)",
        "--justify": props.justify ?? "flex-start",
        "--align": props.align ?? "flex-start",
      }}
    >
      {props.children}
    </div>
  );
}
