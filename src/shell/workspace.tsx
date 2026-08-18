import { For, createSignal, flush, untrack } from "solid-js";
import { Button } from "@opencenter-cloud/kobalte-core/button";
import { Tabs } from "@opencenter-cloud/kobalte-core/tabs";
import { Cover } from "../layouts/cover";
import { Stack } from "../layouts/stack";
import { Cluster } from "../layouts/cluster";
import { createTabSession } from "./tab-session";
import { createThemePref } from "./theme-pref";
import "./workspace.css";

export function Workspace() {
  const session = createTabSession();
  const prefs = createThemePref();
  // Closed Triggers stay mounted: unmounting them on close writes Kobalte's
  // collection from dispose (REACTIVE_WRITE_IN_OWNED_SCOPE). add() also
  // flush()es before the new trigger is registered, so the strip only grows.
  const [strip, setStrip] = createSignal(untrack(() => session.tabs()), {
    ownedWrite: true,
  });
  let listEl: HTMLElement | undefined;
  const isOpen = (id: string) => session.tabs().some((tab) => tab.id === id);

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
              <Tabs.List ref={(el) => { listEl = el; }}>
                <For each={strip()}>
                  {(tab) => (
                    <div class="tab-item" hidden={!isOpen(tab.id)}>
                      <Tabs.Trigger value={tab.id} disabled={!isOpen(tab.id)}>
                        {tab.title}
                      </Tabs.Trigger>
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
              <Button
                aria-label="New tab"
                onClick={() => {
                  session.add();
                  const newest = session.tabs()[session.tabs().length - 1];
                  if (!newest) return;
                  setStrip((list) =>
                    list.some((tab) => tab.id === newest.id)
                      ? list
                      : [...list, newest],
                  );
                  flush();
                  listEl
                    ?.querySelector<HTMLElement>(`[data-key="${newest.id}"]`)
                    ?.click();
                }}
              >
                +
              </Button>
              <Button
                aria-label="Toggle theme"
                onClick={() => prefs.toggle()}
              >
                {prefs.theme() === "light" ? "Dark" : "Light"}
              </Button>
            </Cluster>
            <For each={session.tabs()}>
              {(tab) => (
                <Tabs.Content value={tab.id}>
                  <div class="panel">
                    <p>{tab.title}</p>
                    <p class="panel-note">{tab.state.note}</p>
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
