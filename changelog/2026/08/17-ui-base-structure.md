# UI base structure — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

- **Date:** 2026-08-17
- **Updated:** 2026-08-17 — layout CSS/props taken from the Every Layout EPUB, not the public site
- **Status:** planned (not executed)
- **Scope:** first Solid/Kobalte slice in `app/`: Every Layout primitives, Chouette-derived tokens, flat in-memory tabs
- **Repo:** `/home/paul/Documents/projet-complexe/app` (own git work tree; not the home-dir repo)
- **Related:**
  - [17-ui-design-ideas.md](../../../data/ideas/2026/08/17-ui-design-ideas.md) (modes, coordinates, nested tabs — **out of this slice**)
  - Chouette components: `/home/paul/Documents/chouette.net.br/src/components/` (`hug`, `block`, `measure`)
  - Chouette tokens: `/home/paul/Documents/chouette.net.br/src/routes/main.css`
  - **Every Layout source of truth:** `/mnt/78D4D83ED4D7FBF6/Nextcloud/Work/every-layout/every-layout.epub` (3rd edition ebook; same content as every-layout.dev). Layout chapters: **ch010 Stack**, **ch013 Cluster**, **ch014 Sidebar**, **ch016 Cover**.

**Goal:** Replace the create-tauri-app greet demo with a full-window shell: Cover → Stack → horizontal Cluster of Kobalte tabs, plus add/close, dummy panels, and a small layout kit.

**Architecture:** Tabs are session chrome, not routes. A tab is `{ id, title }` in a Solid signal factory. Kobalte provides accessible tab behavior (unstyled). Layout primitives follow the Every Layout EPUB (ch010/013/014/016 generator CSS + Props API), not `@media` breakpoints. Tokens come from Chouette’s Utopia scales via PostCSS, with `--s1` aliased to `--space-s`. `Sidebar` is implemented and tested but **not mounted** in this chrome (reserved for a later inspector column).

**Tech Stack:** Tauri 2, SolidJS 2.0 RC, Vite 8, `@opencenter-cloud/kobalte-core` (already a dependency), PostCSS + `postcss-utopia`, Vitest + jsdom, pnpm.

## Global Constraints

- Do **not** add TanStack, `@solidjs/router`, Solid Start, or a CSS framework.
- Do **not** implement mode switch, hash codec, nested tabs, address bar, hamburger, GNOME overview, Location type, or ASC IPC.
- Do **not** put a `<button>` inside `Tabs.Trigger` (also a button). Close control is a **sibling**.
- Do **not** load Google fonts. Use Chouette’s `--sans-serif` stack only.
- Do **not** use Chouette’s homepage blue (`--base-bg-color: var(--blue)`) as the app chrome. Port **type + space + measures + grey tokens**. Default surface is inverted: light background, dark text (`--inverted-bg-color` / `--inverted-text-color`).
- Every Layout CSS and props APIs come from the **EPUB generator + Props API sections**, not from every-layout.dev (Cluster and Cover are paywalled there) and not from memory. Path: `/mnt/78D4D83ED4D7FBF6/Nextcloud/Work/every-layout/every-layout.epub`. Implement the published algorithms as Solid components; do not vendor the paid `<stack-l>` custom-element JS.
- Book default space token is `var(--s1)` (“first point on the modular scale”). Alias `--s1: var(--space-s)` in `_tokens.css` so Chouette Utopia and Every Layout share a scale.
- Stack: set `--space` on **children**, not on the parent (EPUB ch010 “Custom property placement”) so nested Stacks keep their own `space`.
- Cluster **component** defaults are `justify`/`align` = `flex-start` (Props API). The generator’s sample CSS uses `center`; follow the Props API.
- Cover book default `minHeight` is `100vh`. Workspace overrides to `100%` because `#root` is already the window. Cover `centered` default is `"h1"`.
- Sidebar `sideWidth` default is **unset** (intrinsic content width). The generator’s `flex-basis: 20rem` is an example, not the component default.
- Kobalte import style already used in `src/App.tsx`: `from "@opencenter-cloud/kobalte-core/button"` — same for tabs: `from "@opencenter-cloud/kobalte-core/tabs"`.
- Solid 2: `jsxImportSource` is `@solidjs/web`. Do **not** add `@solidjs/testing-library` (Solid 1). Tests use Vitest + jsdom + `render` from `@solidjs/web`.
- Leave `src-tauri` greet command as-is (unused). No Rust changes.
- Always ≥1 tab. Last tab’s close control is `disabled`.
- In-memory only. Reload resets to one tab titled `Goal 1`.
- Layout CSS uses the owl (`> * + *`) and `gap` as in Every Layout — no magic-number margins on children.
- `pnpm` only (see `packageManager` in `package.json`).

## Decisions locked in reverse-prompting (2026-08-17)

| Topic | Choice |
|---|---|
| First slice | Flat tabs: add / close / switch, dummy panels, strip greet demo |
| Files / CSS | Hybrid: `src/css/base` + one Solid file per layout primitive (co-located CSS) + `src/shell` |
| Primitives | Cover, Stack, Sidebar, Cluster. Dummy panel = padding class, not a fifth layout |
| Tab model | `{ id, title }` only |
| UX | Start `Goal 1`; `+` adds `Goal N`; `×` closes; cannot close last; click + Kobalte arrows; no Ctrl+T/W |
| Geometry | Horizontal Firefox-like strip. Sidebar primitive exists, unused in v1 chrome |
| Tests | Vitest + layout primitive tests + tab-session tests. No Playwright / Tauri e2e |
| Tokens | Port Chouette Utopia typeScale + spaceScale |
| Utopia how | Add PostCSS + `postcss-utopia` in Vite |
| Every Layout source | EPUB at `/mnt/78D4D83ED4D7FBF6/Nextcloud/Work/every-layout/every-layout.epub` |

## File map

**Create:**

- `postcss.config.js`
- `vitest.config.ts`
- `src/css/base/_reset.css`
- `src/css/base/_tokens.css`
- `src/css/base/_root.css`
- `src/css/index.css`
- `src/layouts/stack.tsx`
- `src/layouts/stack.css`
- `src/layouts/cluster.tsx`
- `src/layouts/cluster.css`
- `src/layouts/cover.tsx`
- `src/layouts/cover.css`
- `src/layouts/sidebar.tsx`
- `src/layouts/sidebar.css`
- `src/shell/tab-session.ts`
- `src/shell/workspace.tsx`
- `src/shell/workspace.css`
- `src/layouts/stack.test.ts`
- `src/layouts/cluster.test.ts`
- `src/layouts/cover.test.ts`
- `src/layouts/sidebar.test.ts`
- `src/shell/tab-session.test.ts`

**Modify:**

- `package.json` — scripts `test`, new devDependencies
- `src/index.tsx` — import `src/css/index.css`
- `src/App.tsx` — render `Workspace` only
- `index.html` — title `Projet Complexe`

**Delete:**

- `src/App.css`

**Do not touch:**

- `src-tauri/**` except if a rebuild is needed incidentally
- `data/ideas/**`

---

### Task 1: PostCSS Utopia, base tokens, Vitest harness

**Files:**

- Create: `postcss.config.js`, `vitest.config.ts`, `src/css/base/_reset.css`, `src/css/base/_tokens.css`, `src/css/base/_root.css`, `src/css/index.css`
- Modify: `package.json`, `src/index.tsx`, `index.html`
- Delete: `src/App.css` (in Task 4, after Workspace exists — keep it until then so `App.tsx` still compiles)

**Interfaces:**

- Consumes: Chouette `:root` Utopia blocks from `/home/paul/Documents/chouette.net.br/src/routes/main.css` (lines 23–69, 75–89, 107–119)
- Produces: CSS custom properties `--size-*`, `--space-*`, `--line-length`, `--max-length`, `--sans-serif`, `--line-height`, greys, `--inverted-bg-color`, `--inverted-text-color` on `:root`

- [ ] **Step 1: Install tooling**

```bash
cd /home/paul/Documents/projet-complexe/app
pnpm add -D postcss postcss-utopia vitest jsdom
```

- [ ] **Step 2: Add `test` script** to `package.json` `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 3: Write `postcss.config.js`**

```js
import utopia from "postcss-utopia";

export default {
  plugins: [utopia()],
};
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import solid from "@solidjs/vite-plugin";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Write `src/css/base/_reset.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  padding: 0;
  min-block-size: 100%;
  block-size: 100%;
}

html {
  block-size: 100%;
}

body {
  min-block-size: 100dvh;
}

img,
svg,
video,
canvas {
  vertical-align: middle;
}
```

- [ ] **Step 6: Write `src/css/base/_tokens.css`**

Copy Chouette’s Utopia settings and measures **verbatim** (same min/max widths and steps). Include greys and inverted aliases. Do **not** set `--base-bg-color` to `--blue`.

```css
:root {
  --line-height: utopia.clamp(21, 23);
  --sans-serif: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial,
    "Liberation Sans", "Nimbus Sans", Roboto, sans-serif;

  @utopia typeScale({
    minWidth: 320,
    maxWidth: 1240,
    minFontSize: 19,
    maxFontSize: 22,
    minTypeScale: 1.2,
    maxTypeScale: 1.25,
    positiveSteps: 5,
    negativeSteps: 3,
    prefix: "size",
  });

  @utopia spaceScale({
    minWidth: 320,
    maxWidth: 1240,
    minSize: 18,
    maxSize: 22,
    positiveSteps: [1.5, 2, 3],
    negativeSteps: [0.75, 0.5],
  });

  --line-length: 36rem;
  --max-length: calc(var(--line-length) * 2 + var(--space-m));
  --scale-max-width: 62rem;

  --color-grey-1: #151515;
  --color-grey-2: #ddd;
  --color-grey-3: #292929;
  --color-grey-4: #1c1c1c;
  --color-grey-5: #717171;

  --grey-dark: var(--color-grey-1);
  --inverted-bg-color: white;
  --inverted-text-color: var(--grey-dark);
  --accent: var(--color-grey-3);

  /* Every Layout EPUB default: space = var(--s1) */
  --s1: var(--space-s);
}
```

If `postcss-utopia` emits `--space-s` / `--space-m` / `--space-l` under different names than Chouette, open Chouette’s compiled CSS or the plugin docs and **alias** `--space-s`, `--space-m`, `--space-l` to whatever the plugin generated. Layouts below assume those three names exist.

- [ ] **Step 7: Write `src/css/base/_root.css`**

```css
html {
  background-color: var(--inverted-bg-color);
  color: var(--inverted-text-color);
  font-family: var(--sans-serif);
  font-size: var(--size-0);
  line-height: var(--line-height);
}
```

- [ ] **Step 8: Write `src/css/index.css`**

```css
@import "./base/_reset.css";
@import "./base/_tokens.css";
@import "./base/_root.css";
```

- [ ] **Step 9: Import tokens from the entry**

In `src/index.tsx`, add as the first import:

```ts
import "./css/index.css";
```

In `index.html`, set `<title>Projet Complexe</title>`.

- [ ] **Step 10: Smoke-check PostCSS**

```bash
cd /home/paul/Documents/projet-complexe/app
pnpm exec vite build
```

Expected: build succeeds. Generated CSS in `dist/assets/*.css` contains `clamp(` for font-size/spacing (Utopia output). If the `@utopia` at-rules leak unprocessed, the plugin is not hooked — fix `postcss.config.js` before continuing.

- [ ] **Step 11: Commit**

```bash
cd /home/paul/Documents/projet-complexe/app
git add package.json pnpm-lock.yaml postcss.config.js vitest.config.ts src/css src/index.tsx index.html
git commit -m "$(cat <<'EOF'
Add Utopia tokens, PostCSS, and Vitest harness.

EOF
)"
```

---

### Task 2: Four Every Layout primitives (from the EPUB)

**Source:** open `/mnt/78D4D83ED4D7FBF6/Nextcloud/Work/every-layout/every-layout.epub` and follow each chapter’s **generator CSS** plus **Props API**. Do not invent shortcuts.

| Component | EPUB chapter | Defaults from Props API |
|---|---|---|
| Stack | ch010 | `space: var(--s1)`, `recursive: false`, `splitAfter` unset |
| Cluster | ch013 | `justify: flex-start`, `align: flex-start`, `space: var(--s1)` |
| Sidebar | ch014 | `side: left`, `sideWidth` unset (intrinsic), `contentMin: 50%`, `space: var(--s1)`, `noStretch: false` |
| Cover | ch016 | `centered: "h1"`, `space: var(--s1)`, `minHeight: 100vh`, `noPad: false` |

**Files:**

- Create: `src/layouts/stack.tsx`, `src/layouts/stack.css`, `src/layouts/cluster.tsx`, `src/layouts/cluster.css`, `src/layouts/cover.tsx`, `src/layouts/cover.css`, `src/layouts/sidebar.tsx`, `src/layouts/sidebar.css`, and the four `*.test.ts` files listed in the file map

**Interfaces:**

```ts
export function Stack(props: {
  space?: string;       // default "var(--s1)"
  recursive?: boolean;
  splitAfter?: number;
  children?: JSX.Element;
}): JSX.Element;

export function Cluster(props: {
  justify?: string;     // default "flex-start"
  align?: string;       // default "flex-start"
  space?: string;       // default "var(--s1)"
  children?: JSX.Element;
}): JSX.Element;

export function Cover(props: {
  centered?: string;    // CSS selector, default "h1"
  space?: string;       // default "var(--s1)"
  minHeight?: string;   // default "100vh"
  noPad?: boolean;
  children?: JSX.Element;
}): JSX.Element;

export function Sidebar(props: {
  side?: "left" | "right";
  sideWidth?: string;   // unset = content width
  contentMin?: string;  // default "50%"
  space?: string;       // default "var(--s1)"
  noStretch?: boolean;
  children?: JSX.Element; // two children
}): JSX.Element;
```

- [ ] **Step 1: Write the failing Stack test** `src/layouts/stack.test.ts`

```ts
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
  const a = host.querySelector("[data-a]") as HTMLElement;
  const b = host.querySelector("[data-b]") as HTMLElement;
  expect(getComputedStyle(a).marginBlockStart).toBe("0px");
  expect(getComputedStyle(b).marginBlockStart).toBe("8px");
});
```

- [ ] **Step 2: Run it — expect FAIL** (module not found)

```bash
cd /home/paul/Documents/projet-complexe/app
pnpm test src/layouts/stack.test.ts
```

- [ ] **Step 3: Implement Stack** (EPUB ch010 generator CSS + Props API)

`--space` lives on **children** (`--layout-space` on the parent is only the Solid prop bridge). Recursive mode drops the child combinator. `splitAfter` sets `margin-block-end: auto` on that nth-child.

`src/layouts/stack.css`:

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack > * {
  --space: var(--layout-space, var(--s1));
  margin-block: 0;
}

.stack > * + * {
  margin-block-start: var(--space, 1.5rem);
}

.stack--recursive * + * {
  margin-block-start: var(--space, 1.5rem);
}

.stack:only-child {
  block-size: 100%;
}

.stack--split-1 > :nth-child(1),
.stack--split-2 > :nth-child(2),
.stack--split-3 > :nth-child(3) {
  margin-block-end: auto;
}
```

`src/layouts/stack.tsx`:

```tsx
import type { JSX } from "solid-js";
import "./stack.css";

export function Stack(props: {
  space?: string;
  recursive?: boolean;
  splitAfter?: number;
  children?: JSX.Element;
}) {
  const splitClass =
    props.splitAfter === 1
      ? "stack--split-1"
      : props.splitAfter === 2
        ? "stack--split-2"
        : props.splitAfter === 3
          ? "stack--split-3"
          : undefined;

  return (
    <div
      class="stack"
      classList={{
        "stack--recursive": props.recursive,
        [splitClass ?? ""]: Boolean(splitClass),
      }}
      style={{ "--layout-space": props.space ?? "var(--s1)" }}
    >
      {props.children}
    </div>
  );
}
```

- [ ] **Step 4: Run Stack test — expect PASS**

```bash
pnpm test src/layouts/stack.test.ts
```

- [ ] **Step 5: Cluster test + implementation** (EPUB ch013)

Test: `.cluster` is `display: flex`, `flex-wrap: wrap`, and `justify-content` / `align-items` default to `flex-start` (Props API, not the generator sample that uses `center`).

`src/layouts/cluster.css` (generator `gap` solution):

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, var(--s1));
  justify-content: var(--justify, flex-start);
  align-items: var(--align, flex-start);
}
```

Set `--space`, `--justify`, `--align` from props. Default space `var(--s1)`.

- [ ] **Step 6: Cover test + implementation** (EPUB ch016)

Test: `min-block-size` matches `minHeight` (e.g. `200px`). Test: an `<h1>` child has `margin-block: auto` (default `centered="h1"`). Test: `noPad` removes padding.

Book generator CSS (centered element is configurable; default `h1`):

```css
.cover {
  display: flex;
  flex-direction: column;
  min-block-size: var(--cover-min-height, 100vh);
  padding: var(--space, var(--s1));
}

.cover--no-pad {
  padding: 0;
}

.cover > * {
  margin-block: var(--space, var(--s1));
}

.cover > :first-child:not(:is(.cover-principal)) {
  margin-block-start: 0;
}

.cover > :last-child:not(:is(.cover-principal)) {
  margin-block-end: 0;
}

.cover > .cover-principal {
  margin-block: auto;
}
```

In the Solid component, mark the direct child that matches `props.centered` (default `"h1"`) with class `cover-principal`. Do **not** wrap extra divs.

Workspace (Task 4) passes `minHeight="100%"` `noPad` `space="0px"` and has **no** `h1`, so the single Stack is first and last `:not(.cover-principal)` → outer margins 0, filling the window from the top (not a hero).

- [ ] **Step 7: Sidebar test + implementation** (EPUB ch014)

Test: two children, last child `flex-grow` is `999` when `side` is `left`. Test: `noStretch` sets `align-items: flex-start`. Test: omitted `sideWidth` leaves sidebar `flex-basis: auto`.

Generator CSS (assumes sidebar is `:first-child`). Component `side="right"` swaps which child gets which rule (Props API: any value other than `"left"` is right).

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gutter, var(--s1));
  align-items: stretch;
}

.with-sidebar--no-stretch {
  align-items: flex-start;
}

.with-sidebar > .sidebar {
  flex-basis: var(--side-width, auto);
  flex-grow: 1;
}

.with-sidebar > .not-sidebar {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: var(--content-min, 50%);
}
```

In TSX: two children; if `side === "right"`, first is `.not-sidebar` and second is `.sidebar`; otherwise first `.sidebar`, last `.not-sidebar`. Only set `--side-width` when `sideWidth` is passed. `--content-min` default `50%`. `--gutter` from `space` default `var(--s1)`.

- [ ] **Step 8: Run all layout tests**

```bash
pnpm test src/layouts
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/layouts
git commit -m "$(cat <<'EOF'
Add Stack, Cluster, Cover, and Sidebar layout primitives.

EOF
)"
```

---

### Task 3: Tab session store

**Files:**

- Create: `src/shell/tab-session.ts`, `src/shell/tab-session.test.ts`

**Interfaces:**

- Consumes: nothing from layouts
- Produces:

```ts
export type Tab = { id: string; title: string };

export type TabSession = {
  tabs: () => Tab[];
  activeId: () => string;
  setActiveId: (id: string) => void;
  add: () => void;
  close: (id: string) => void;
};

export function createTabSession(): TabSession;
```

Rules:

- Initial state: `[{ id: "1", title: "Goal 1" }]`, `activeId === "1"`.
- `add()` appends `{ id: String(n), title: \`Goal ${n}\` }` where `n` is a monotonic counter starting at 1 (next add is `Goal 2` with `id: "2"`). New tab becomes active.
- `close(id)` is a no-op when `tabs().length === 1`.
- If the closed tab was active, activate the neighbour to the left, or the new first tab if the first was closed.
- Ids are strings (Kobalte `value` is a string).

- [ ] **Step 1: Write `src/shell/tab-session.test.ts`** (failing)

```ts
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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test src/shell/tab-session.test.ts
```

- [ ] **Step 3: Implement `src/shell/tab-session.ts`**

```ts
import { createSignal } from "solid-js";

export type Tab = { id: string; title: string };

export type TabSession = {
  tabs: () => Tab[];
  activeId: () => string;
  setActiveId: (id: string) => void;
  add: () => void;
  close: (id: string) => void;
};

export function createTabSession(): TabSession {
  let seq = 1;
  const [tabs, setTabs] = createSignal<Tab[]>([{ id: "1", title: "Goal 1" }]);
  const [activeId, setActiveId] = createSignal("1");

  const add = () => {
    seq += 1;
    const id = String(seq);
    const next: Tab = { id, title: `Goal ${seq}` };
    setTabs((list) => [...list, next]);
    setActiveId(id);
  };

  const close = (id: string) => {
    const list = tabs();
    if (list.length <= 1) return;
    const index = list.findIndex((t) => t.id === id);
    if (index < 0) return;
    const remaining = list.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeId() === id) {
      const neighbour = remaining[Math.max(0, index - 1)];
      setActiveId(neighbour.id);
    }
  };

  return { tabs, activeId, setActiveId, add, close };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test src/shell/tab-session.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/shell/tab-session.ts src/shell/tab-session.test.ts
git commit -m "$(cat <<'EOF'
Add in-memory tab session with last-tab guard.

EOF
)"
```

---

### Task 4: Workspace chrome (Kobalte Tabs + layouts)

**Files:**

- Create: `src/shell/workspace.tsx`, `src/shell/workspace.css`
- Modify: `src/App.tsx`
- Delete: `src/App.css`

**Interfaces:**

- Consumes: `createTabSession`, `Cover`, `Stack`, `Cluster`, `Tabs` from `@opencenter-cloud/kobalte-core/tabs`, `Button` from `@opencenter-cloud/kobalte-core/button`
- Produces: `export function Workspace(): JSX.Element`

Composition (horizontal Firefox strip):

```text
Cover (minHeight 100%, noPad, space 0)  ← EPUB default minHeight is 100vh; override to 100% of #root
  Stack (space 0)          ← extra class workspace-stack: last child flex-grow 1; block-size 100%
    Cluster                ← tab strip + add
      Tabs.Root (controlled)
        Tabs.List
          for each tab:
            div.tab-item
              Tabs.Trigger
              Button close (sibling, disabled if last)
          Button add
        for each tab:
          Tabs.Content
            dummy panel (class panel) showing the title
```

`Tabs.Root` is controlled:

```tsx
<Tabs
  value={session.activeId()}
  onChange={session.setActiveId}
  orientation="horizontal"
>
```

The `+` button is **not** a tab trigger. The close `Button` is a sibling of `Tabs.Trigger` inside `.tab-item`.

Dummy panel markup:

```tsx
<div class="panel">
  <p>{tab.title}</p>
</div>
```

`.panel` padding: `var(--space-m)`. No new layout primitive.

- [ ] **Step 1: Write `src/shell/workspace.css`**

```css
.workspace-stack {
  block-size: 100%;
}

.workspace-stack > :last-child {
  flex: 1 1 auto;
  min-block-size: 0;
}

.tab-item {
  display: flex;
  align-items: stretch;
}

.tab-item [data-selected] {
  font-weight: 600;
}

.panel {
  padding: var(--space-m);
  min-block-size: 0;
  overflow: auto;
}
```

Style Kobalte triggers/buttons with existing tokens only (no leftover Vite purple). Example:

```css
.workspace button {
  appearance: none;
  font: inherit;
  color: inherit;
  background: transparent;
  border: 1px solid var(--color-grey-2);
  padding: var(--space-3xs, 0.25rem) var(--space-s);
  cursor: pointer;
}

.workspace button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

If `--space-3xs` does not exist after Utopia, use `0.25rem`.

- [ ] **Step 2: Write `src/shell/workspace.tsx`**

```tsx
import { For } from "solid-js";
import { Button } from "@opencenter-cloud/kobalte-core/button";
import { Tabs } from "@opencenter-cloud/kobalte-core/tabs";
import { Cover } from "../layouts/cover";
import { Stack } from "../layouts/stack";
import { Cluster } from "../layouts/cluster";
import { createTabSession } from "./tab-session";
import "./workspace.css";

export function Workspace() {
  const session = createTabSession();

  return (
    <Cover minHeight="100%" noPad space="0px">
      <Stack space="0px">
        <div class="workspace">
          <Tabs
            class="workspace-stack"
            value={session.activeId()}
            onChange={session.setActiveId}
            orientation="horizontal"
          >
            <Cluster space="var(--space-3xs, 0.25rem)">
              <Tabs.List>
                <For each={session.tabs()}>
                  {(tab) => (
                    <div class="tab-item">
                      <Tabs.Trigger value={tab.id}>{tab.title}</Tabs.Trigger>
                      <Button
                        aria-label={`Close ${tab.title}`}
                        disabled={session.tabs().length === 1}
                        onClick={() => session.close(tab.id)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </For>
              </Tabs.List>
              <Button aria-label="New tab" onClick={() => session.add()}>
                +
              </Button>
            </Cluster>
            <For each={session.tabs()}>
              {(tab) => (
                <Tabs.Content value={tab.id}>
                  <div class="panel">
                    <p>{tab.title}</p>
                  </div>
                </Tabs.Content>
              )}
            </For>
          </Tabs>
        </div>
      </Stack>
    </Cover>
  );
}
```

**If** Kobalte `Tabs` / `Tabs.List` refuse a class on `Root` or break because `Cluster` wraps `List`: unwrap so the DOM is `Tabs > Cluster(List, add) + Contents`. The Stack grow rule must apply to `Tabs.Content` (the last visible panel). Adjust `workspace-stack` onto `Tabs` (the Root) so Root is `display:flex; flex-direction:column; block-size:100%` and `Tabs.Content` grows. Do **not** put Cluster around Root.

If Root is not a flex column by default, add:

```css
.workspace [data-orientation="horizontal"] {
  display: flex;
  flex-direction: column;
  block-size: 100%;
}

.workspace [data-orientation="horizontal"] [role="tabpanel"] {
  flex: 1 1 auto;
  min-block-size: 0;
}
```

Kobalte sets `data-orientation` on Root (see `TabsRootRenderProps`).

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { Workspace } from "./shell/workspace";

export default function App() {
  return <Workspace />;
}
```

Remove `import "./App.css"` and delete `src/App.css`. Remove the Kobalte Button smoke-test section (tabs now prove Kobalte). Remove `invoke` / greet.

- [ ] **Step 4: Typecheck and unit tests**

```bash
cd /home/paul/Documents/projet-complexe/app
pnpm exec tsc --noEmit
pnpm test
```

Expected: PASS, no unused imports (`noUnusedLocals` is on).

- [ ] **Step 5: Manual check**

```bash
pnpm tauri dev
```

Expected:

1. Window fills with a light workspace (no Vite logos, no greet form).
2. One tab `Goal 1` with dummy panel text `Goal 1`.
3. `+` creates `Goal 2` and shows that panel.
4. `×` on `Goal 2` returns to `Goal 1`.
5. `×` on the last remaining tab does nothing (control disabled).
6. Arrow keys move between tab triggers (Kobalte).

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/shell src/index.tsx
git rm src/App.css
git commit -m "$(cat <<'EOF'
Replace greet demo with a Kobalte tab workspace.

EOF
)"
```

---

## Out of scope (already designed elsewhere)

Leave these in [17-ui-design-ideas.md](../../../data/ideas/2026/08/17-ui-design-ideas.md) until a later changelog:

- task / knowledge mode on a shared coordinate
- hash codec
- nested tabs / book groups
- GNOME-style overview
- address bar over ASC pivots
- time vs genericity zoom
- Pixi graph, `code-graph-rag`

## Spec coverage (self-review)

| Requirement | Task |
|---|---|
| Strip greet demo | 4 |
| Flat add/close/switch tabs | 3, 4 |
| `{ id, title }` | 3 |
| Last-tab guard | 3, 4 |
| Horizontal strip | 4 |
| Cover, Stack, Cluster, Sidebar | 2 |
| Sidebar unused in chrome | 4 (not imported in workspace) |
| Chouette Utopia via PostCSS | 1 |
| Vitest layout + session tests | 1–3 |
| Kobalte Tabs + Button | 4 |
| No nested button | 4 (close sibling) |
| No TanStack / router / hash / mode | constraints |

## Placeholder scan

None of TBD / “handle edge cases” / “write tests later”. If Utopia name aliases differ, Task 1 Step 6 says how to resolve them before layouts land.

---

Plan complete and saved to `app/changelog/2026/08/17-ui-base-structure.md`.

Two execution options:

1. **Subagent-driven** (recommended) — a fresh subagent per task, review between tasks
2. **Inline** — execute tasks in this session with checkpoints

Which approach?
