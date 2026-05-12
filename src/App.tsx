import ReactDOM from "react-dom/client";
import type { Selection } from "@heroui/react";
import { Button, Dropdown, Header, Label } from "@heroui/react";
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import localHeroUiStylesUrl from "./App.css?url";

const HEROUI_DOCS_CSS_URLS = [
  "https://heroui.com/_next/static/chunks/0d7fc5981fb44537.css",
  "https://heroui.com/_next/static/chunks/3f02df7b5a424384.css",
];

const CSS_MODES = [
  "docs",
  "local",
  "none",
  "docs-no-animation",
  "local-no-animation",
] as const;

type CssMode = (typeof CSS_MODES)[number];

const OVERLAY_MODES = [
  "default",
  "root-portal",
  "root-boundary",
  "root-portal-boundary",
] as const;

type OverlayMode = (typeof OVERLAY_MODES)[number];

const MODAL_MODES = ["default", "non-modal"] as const;

type ModalMode = (typeof MODAL_MODES)[number];

const MAX_HEIGHT_MODES = ["default", "320", "640"] as const;

type MaxHeightMode = (typeof MAX_HEIGHT_MODES)[number];

const ANIMATION_MODES = [
  "default",
  "none",
  "none-fade",
  "opacity",
  "no-transform",
  "no-opacity",
  "no-motion-vars",
  "no-keyframe-vars",
  "no-transition",
  "transition-transform",
  "transition-visual",
] as const;

type AnimationMode = (typeof ANIMATION_MODES)[number];

const SHELL_MODES = [
  "docs",
  "preview",
  "article",
  "article-plain",
  "grid-flow",
  "grid-flow-100",
  "grid-flow-no-trailing",
  "grid-86",
  "grid-centered",
  "grid",
  "theme-86",
  "theme",
  "root-static",
  "root-absolute",
  "bare",
] as const;

type ShellMode = (typeof SHELL_MODES)[number];

interface ProbeSample {
  animationMode: AnimationMode;
  animationName: string | null;
  documentClientHeight: number;
  documentScrollHeight: number;
  frame: number;
  offsetParent: string | null;
  placement: string | null;
  popoverBottom: number | null;
  popoverHeight: number | null;
  popoverMaxHeight: string | null;
  popoverOpacity: string | null;
  popoverPosition: string | null;
  popoverStyleBottom: string | null;
  popoverStyleTop: string | null;
  popoverTop: number | null;
  popoverTransform: string | null;
  rootScrollHeight: number | null;
  rootScrollTop: number | null;
  scrollY: number;
  shell: ShellMode;
  css: CssMode;
  maxHeightMode: MaxHeightMode;
  modalMode: ModalMode;
  overlayMode: OverlayMode;
  portalParent: string | null;
  timestamp: number;
  transitionDuration: string | null;
  transitionProperty: string | null;
  transitionTimingFunction: string | null;
  triggerBottom: number | null;
  triggerDocumentTop: number | null;
  triggerHeight: number | null;
  triggerTop: number | null;
  twEnterOpacity: string | null;
  twEnterScale: string | null;
  twEnterTranslateY: string | null;
  visualViewportHeight: number | null;
  visualViewportOffsetTop: number | null;
}

const FRUITS = [
  "Apple",
  "Banana",
  "Cherry",
  "Orange",
  "Pear",
  "Mango",
  "Plum",
  "Grape",
  "Peach",
  "Kiwi",
  "Papaya",
  "Apricot",
];

function isCssMode(value: string | null): value is CssMode {
  return CSS_MODES.includes(value as CssMode);
}

function isOverlayMode(value: string | null): value is OverlayMode {
  return OVERLAY_MODES.includes(value as OverlayMode);
}

function isModalMode(value: string | null): value is ModalMode {
  return MODAL_MODES.includes(value as ModalMode);
}

function isMaxHeightMode(value: string | null): value is MaxHeightMode {
  return MAX_HEIGHT_MODES.includes(value as MaxHeightMode);
}

function isAnimationMode(value: string | null): value is AnimationMode {
  return ANIMATION_MODES.includes(value as AnimationMode);
}

function initialCssMode(): CssMode {
  const mode = new URLSearchParams(window.location.search).get("css");
  return isCssMode(mode) ? mode : "docs";
}

function initialOverlayMode(): OverlayMode {
  const mode = new URLSearchParams(window.location.search).get("overlay");
  return isOverlayMode(mode) ? mode : "default";
}

function initialModalMode(): ModalMode {
  const mode = new URLSearchParams(window.location.search).get("modal");
  return isModalMode(mode) ? mode : "default";
}

function initialMaxHeightMode(): MaxHeightMode {
  const mode = new URLSearchParams(window.location.search).get("maxh");
  return isMaxHeightMode(mode) ? mode : "default";
}

function initialAnimationMode(): AnimationMode {
  const mode = new URLSearchParams(window.location.search).get("anim");
  return isAnimationMode(mode) ? mode : "default";
}

function initialItemCount() {
  const count = Number(new URLSearchParams(window.location.search).get("items"));
  if (Number.isInteger(count) && count >= 3 && count <= FRUITS.length) {
    return count;
  }
  return 5;
}

function initialDebugEnabled() {
  const debug = new URLSearchParams(window.location.search).get("debug");
  return debug === "1" || debug === "true";
}

function isShellMode(value: string | null): value is ShellMode {
  return SHELL_MODES.includes(value as ShellMode);
}

function initialShellMode(): ShellMode {
  const shell = new URLSearchParams(window.location.search).get("shell");
  return isShellMode(shell) ? shell : "docs";
}

function hrefFor(nextMode: CssMode, itemCount: number, shell: ShellMode) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", nextMode);
  params.set("items", String(itemCount));
  params.set("shell", shell);
  return `${window.location.pathname}?${params.toString()}`;
}

function countHrefFor(nextCount: number, mode: CssMode, shell: ShellMode) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(nextCount));
  params.set("shell", shell);
  return `${window.location.pathname}?${params.toString()}`;
}

function shellHrefFor(nextShell: ShellMode, mode: CssMode, itemCount: number) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(itemCount));
  params.set("shell", nextShell);
  return `${window.location.pathname}?${params.toString()}`;
}

function overlayHrefFor(
  nextOverlayMode: OverlayMode,
  mode: CssMode,
  itemCount: number,
  shell: ShellMode,
) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(itemCount));
  params.set("shell", shell);
  params.set("overlay", nextOverlayMode);
  return `${window.location.pathname}?${params.toString()}`;
}

function modalHrefFor(
  nextModalMode: ModalMode,
  mode: CssMode,
  itemCount: number,
  shell: ShellMode,
) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(itemCount));
  params.set("shell", shell);
  params.set("modal", nextModalMode);
  return `${window.location.pathname}?${params.toString()}`;
}

function maxHeightHrefFor(
  nextMaxHeightMode: MaxHeightMode,
  mode: CssMode,
  itemCount: number,
  shell: ShellMode,
) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(itemCount));
  params.set("shell", shell);
  params.set("maxh", nextMaxHeightMode);
  return `${window.location.pathname}?${params.toString()}`;
}

function animationHrefFor(
  nextAnimationMode: AnimationMode,
  mode: CssMode,
  itemCount: number,
  shell: ShellMode,
) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(itemCount));
  params.set("shell", shell);
  params.set("anim", nextAnimationMode);
  return `${window.location.pathname}?${params.toString()}`;
}

function debugHrefFor(
  nextDebugEnabled: boolean,
  mode: CssMode,
  itemCount: number,
  shell: ShellMode,
) {
  const params = new URLSearchParams(window.location.search);
  params.set("css", mode);
  params.set("items", String(itemCount));
  params.set("shell", shell);
  if (nextDebugEnabled) {
    params.set("debug", "1");
  } else {
    params.delete("debug");
  }
  return `${window.location.pathname}?${params.toString()}`;
}

function stylesheetsFor(mode: CssMode) {
  if (mode.startsWith("docs")) {
    return HEROUI_DOCS_CSS_URLS;
  }
  if (mode.startsWith("local")) {
    return [localHeroUiStylesUrl];
  }
  return [];
}

function usesDocsDocumentShell(shell: ShellMode) {
  return shell !== "bare";
}

function usesAppRootScrollShell(shell: ShellMode) {
  return shell === "root-static" || shell === "root-absolute";
}

function usesRootPortal(overlayMode: OverlayMode) {
  return overlayMode === "root-portal" || overlayMode === "root-portal-boundary";
}

function usesRootBoundary(overlayMode: OverlayMode) {
  return overlayMode === "root-boundary" || overlayMode === "root-portal-boundary";
}

function usesNonModal(modalMode: ModalMode) {
  return modalMode === "non-modal";
}

function maxHeightFor(maxHeightMode: MaxHeightMode) {
  return maxHeightMode === "default" ? undefined : Number(maxHeightMode);
}

function effectiveAnimationMode(mode: CssMode, animationMode: AnimationMode) {
  return mode.endsWith("no-animation") ? "none" : animationMode;
}

function useProbeStyles(
  mode: CssMode,
  shell: ShellMode,
  animationMode: AnimationMode,
) {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");
    const previousHtmlClass = html.className;
    const previousLang = html.getAttribute("lang");
    const previousColorScheme = html.style.colorScheme;
    const previousBodyClass = body.className;
    const previousBodyStyle = body.style.cssText;
    const previousRootStyle = root?.style.cssText;
    const previousAnimationFlag = html.dataset.probeDisableDropdownAnimation;
    const previousAnimationMode = html.dataset.probeDropdownAnimation;
    const urls = stylesheetsFor(mode);
    const docsDocumentShell = usesDocsDocumentShell(shell);
    const appRootScrollShell = usesAppRootScrollShell(shell);
    const animationOverride = effectiveAnimationMode(mode, animationMode);

    setReady(urls.length === 0);
    html.className = docsDocumentShell
      ? "inter_5901b7c6-module__ec5Qua__variable light"
      : "light";
    if (docsDocumentShell) {
      html.lang = "en";
    } else {
      html.removeAttribute("lang");
    }
    html.style.colorScheme = "light";
    body.className = "flex min-h-screen flex-col font-sans probe-docs-body";
    if (appRootScrollShell && root) {
      body.style.height = "100vh";
      body.style.overflow = "hidden";
      root.style.height = "100vh";
      root.style.overflowX = "hidden";
      root.style.overflowY = "auto";
      root.style.position = shell === "root-absolute" ? "absolute" : "static";
      if (shell === "root-absolute") {
        root.style.inset = "0";
      } else {
        root.style.inset = "";
      }
    }

    html.dataset.probeDropdownAnimation = animationOverride;
    if (animationOverride === "none") {
      html.dataset.probeDisableDropdownAnimation = "true";
    } else {
      delete html.dataset.probeDisableDropdownAnimation;
    }

    const links = urls.map((url) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.dataset.dropdownProbeStylesheet = "true";
      if (mode.startsWith("docs")) {
        link.setAttribute("data-precedence", "next");
      }
      document.head.appendChild(link);
      return link;
    });

    if (links.length > 0) {
      let remaining = links.length;
      const markReady = () => {
        remaining -= 1;
        if (remaining <= 0) {
          setReady(true);
        }
      };

      for (const link of links) {
        link.addEventListener("load", markReady, { once: true });
        link.addEventListener("error", markReady, { once: true });
      }
    }

    return () => {
      for (const link of links) {
        link.remove();
      }
      html.className = previousHtmlClass;
      if (previousLang === null) {
        html.removeAttribute("lang");
      } else {
        html.lang = previousLang;
      }
      html.style.colorScheme = previousColorScheme;
      body.className = previousBodyClass;
      body.style.cssText = previousBodyStyle;
      if (root && previousRootStyle !== undefined) {
        root.style.cssText = previousRootStyle;
      }
      if (previousAnimationFlag === undefined) {
        delete html.dataset.probeDisableDropdownAnimation;
      } else {
        html.dataset.probeDisableDropdownAnimation = previousAnimationFlag;
      }
      if (previousAnimationMode === undefined) {
        delete html.dataset.probeDropdownAnimation;
      } else {
        html.dataset.probeDropdownAnimation = previousAnimationMode;
      }
    };
  }, [animationMode, mode, shell]);

  return ready;
}

function ProbeToolbar({
  animationMode,
  itemCount,
  maxHeightMode,
  modalMode,
  mode,
  overlayMode,
  shell,
  debugEnabled,
}: {
  animationMode: AnimationMode;
  debugEnabled: boolean;
  itemCount: number;
  maxHeightMode: MaxHeightMode;
  modalMode: ModalMode;
  mode: CssMode;
  overlayMode: OverlayMode;
  shell: ShellMode;
}) {
  return (
    <nav aria-label="Dropdown probe controls" className="probe-toolbar">
      <div className="probe-toolbar__group">
        {CSS_MODES.map((nextMode) => (
          <a
            aria-current={mode === nextMode ? "page" : undefined}
            className="probe-toolbar__link"
            href={hrefFor(nextMode, itemCount, shell)}
            key={nextMode}
          >
            {nextMode}
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        {[5, 10, 12].map((count) => (
          <a
            aria-current={itemCount === count ? "page" : undefined}
            className="probe-toolbar__link"
            href={countHrefFor(count, mode, shell)}
            key={count}
          >
            {count} items
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        {SHELL_MODES.map((nextShell) => (
          <a
            aria-current={shell === nextShell ? "page" : undefined}
            className="probe-toolbar__link"
            href={shellHrefFor(nextShell, mode, itemCount)}
            key={nextShell}
          >
            {nextShell} shell
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        {OVERLAY_MODES.map((nextOverlayMode) => (
          <a
            aria-current={overlayMode === nextOverlayMode ? "page" : undefined}
            className="probe-toolbar__link"
            href={overlayHrefFor(nextOverlayMode, mode, itemCount, shell)}
            key={nextOverlayMode}
          >
            {nextOverlayMode} overlay
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        {MODAL_MODES.map((nextModalMode) => (
          <a
            aria-current={modalMode === nextModalMode ? "page" : undefined}
            className="probe-toolbar__link"
            href={modalHrefFor(nextModalMode, mode, itemCount, shell)}
            key={nextModalMode}
          >
            {nextModalMode} modal
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        {MAX_HEIGHT_MODES.map((nextMaxHeightMode) => (
          <a
            aria-current={maxHeightMode === nextMaxHeightMode ? "page" : undefined}
            className="probe-toolbar__link"
            href={maxHeightHrefFor(nextMaxHeightMode, mode, itemCount, shell)}
            key={nextMaxHeightMode}
          >
            {nextMaxHeightMode === "default"
              ? "default maxH"
              : `${nextMaxHeightMode}px maxH`}
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        {ANIMATION_MODES.map((nextAnimationMode) => (
          <a
            aria-current={animationMode === nextAnimationMode ? "page" : undefined}
            className="probe-toolbar__link"
            href={animationHrefFor(nextAnimationMode, mode, itemCount, shell)}
            key={nextAnimationMode}
          >
            {nextAnimationMode} anim
          </a>
        ))}
      </div>
      <div className="probe-toolbar__group">
        <a
          aria-current={debugEnabled ? "page" : undefined}
          className="probe-toolbar__link"
          href={debugHrefFor(!debugEnabled, mode, itemCount, shell)}
        >
          debug {debugEnabled ? "on" : "off"}
        </a>
      </div>
    </nav>
  );
}

function roundMetric(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.round(value * 100) / 100
    : null;
}

function describeElement(element: Element | null) {
  if (!element) return null;
  const id = element.id ? `#${element.id}` : "";
  const className = element instanceof HTMLElement
    ? Array.from(element.classList).slice(0, 3).map((name) => `.${name}`).join("")
    : "";
  return `${element.tagName.toLowerCase()}${id}${className}`;
}

function readProbeSample({
  animationMode,
  css,
  frame,
  maxHeightMode,
  modalMode,
  overlayMode,
  shell,
  trigger,
}: {
  animationMode: AnimationMode;
  css: CssMode;
  frame: number;
  maxHeightMode: MaxHeightMode;
  modalMode: ModalMode;
  overlayMode: OverlayMode;
  shell: ShellMode;
  trigger: HTMLElement | null;
}): ProbeSample {
  const root = document.getElementById("root");
  const popover = document.querySelector<HTMLElement>(
    ".dropdown__popover[data-entering], .dropdown__popover",
  );
  const triggerRect = trigger?.getBoundingClientRect();
  const popoverRect = popover?.getBoundingClientRect();
  const popoverStyle = popover ? window.getComputedStyle(popover) : null;

  return {
    animationMode,
    animationName: popoverStyle?.animationName ?? null,
    css,
    documentClientHeight: document.documentElement.clientHeight,
    documentScrollHeight: document.documentElement.scrollHeight,
    frame,
    maxHeightMode,
    modalMode,
    offsetParent: describeElement(popover?.offsetParent ?? null),
    overlayMode,
    placement: popover?.dataset.placement ?? null,
    popoverBottom: roundMetric(popoverRect?.bottom),
    popoverHeight: roundMetric(popoverRect?.height),
    popoverMaxHeight: popover?.style.maxHeight || popoverStyle?.maxHeight || null,
    popoverOpacity: popoverStyle?.opacity ?? null,
    popoverPosition: popoverStyle?.position ?? null,
    popoverStyleBottom: popover?.style.bottom || null,
    popoverStyleTop: popover?.style.top || null,
    popoverTop: roundMetric(popoverRect?.top),
    popoverTransform: popoverStyle?.transform ?? null,
    portalParent: describeElement(popover?.parentElement ?? null),
    rootScrollHeight: root ? root.scrollHeight : null,
    rootScrollTop: root ? roundMetric(root.scrollTop) : null,
    scrollY: roundMetric(window.scrollY) ?? 0,
    shell,
    timestamp: roundMetric(performance.now()) ?? 0,
    transitionDuration: popoverStyle?.transitionDuration ?? null,
    transitionProperty: popoverStyle?.transitionProperty ?? null,
    transitionTimingFunction: popoverStyle?.transitionTimingFunction ?? null,
    triggerBottom: roundMetric(triggerRect?.bottom),
    triggerDocumentTop: triggerRect
      ? roundMetric(triggerRect.top + window.scrollY + (root?.scrollTop ?? 0))
      : null,
    triggerHeight: roundMetric(triggerRect?.height),
    triggerTop: roundMetric(triggerRect?.top),
    twEnterOpacity: popoverStyle?.getPropertyValue("--tw-enter-opacity") || null,
    twEnterScale: popoverStyle?.getPropertyValue("--tw-enter-scale") || null,
    twEnterTranslateY:
      popoverStyle?.getPropertyValue("--tw-enter-translate-y") || null,
    visualViewportHeight: roundMetric(window.visualViewport?.height),
    visualViewportOffsetTop: roundMetric(window.visualViewport?.offsetTop),
  };
}

function logProbeSamples(samples: ProbeSample[]) {
  const {
    animationMode,
    css,
    maxHeightMode,
    modalMode,
    overlayMode,
    shell,
  } = samples[0] ?? {};
  console.groupCollapsed(
    `[dropdown-probe] shell=${shell ?? "unknown"} css=${css ?? "unknown"} overlay=${overlayMode ?? "unknown"} modal=${modalMode ?? "unknown"} maxh=${maxHeightMode ?? "unknown"} anim=${animationMode ?? "unknown"}`,
  );
  console.table(samples);
  console.groupEnd();
}

function DebugPanel({ samples }: { samples: ProbeSample[] }) {
  if (samples.length === 0) {
    return (
      <aside className="probe-debug-panel">
        <div className="probe-debug-panel__title">Dropdown Debug</div>
        <div className="probe-debug-panel__empty">Open the dropdown to sample.</div>
      </aside>
    );
  }

  return (
    <aside className="probe-debug-panel">
      <div className="probe-debug-panel__title">Dropdown Debug</div>
      <table>
        <thead>
          <tr>
            <th>f</th>
            <th>place</th>
            <th>maxH</th>
            <th>popTop</th>
            <th>popH</th>
            <th>op</th>
            <th>eOp</th>
            <th>eSc</th>
            <th>eY</th>
            <th>portal</th>
            <th>trigTop</th>
            <th>docTop</th>
            <th>scroll</th>
            <th>root</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr key={`${sample.timestamp}-${sample.frame}`}>
              <td>{sample.frame}</td>
              <td>{sample.placement ?? "-"}</td>
              <td>{sample.popoverMaxHeight ?? "-"}</td>
              <td>{sample.popoverTop ?? "-"}</td>
              <td>{sample.popoverHeight ?? "-"}</td>
              <td>{sample.popoverOpacity ?? "-"}</td>
              <td>{sample.twEnterOpacity ?? "-"}</td>
              <td>{sample.twEnterScale ?? "-"}</td>
              <td>{sample.twEnterTranslateY ?? "-"}</td>
              <td>{sample.portalParent ?? "-"}</td>
              <td>{sample.triggerTop ?? "-"}</td>
              <td>{sample.triggerDocumentTop ?? "-"}</td>
              <td>{sample.scrollY}</td>
              <td>{sample.rootScrollTop ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}

function DocsSingleSelectionDropdown({
  animationMode,
  debugEnabled,
  itemCount,
  maxHeightMode,
  modalMode,
  mode,
  onDebugSamples,
  overlayMode,
  shell,
}: {
  animationMode: AnimationMode;
  debugEnabled: boolean;
  itemCount: number;
  maxHeightMode: MaxHeightMode;
  modalMode: ModalMode;
  mode: CssMode;
  onDebugSamples: (samples: ProbeSample[]) => void;
  overlayMode: OverlayMode;
  shell: ShellMode;
}) {
  const [selected, setSelected] = useState<Selection>(new Set(["apple"]));
  const items = useMemo(() => FRUITS.slice(0, itemCount), [itemCount]);
  const root = document.getElementById("root") ?? undefined;
  const portalContainer = usesRootPortal(overlayMode) ? root : undefined;
  const boundaryElement = usesRootBoundary(overlayMode) ? root : undefined;
  const maxHeight = maxHeightFor(maxHeightMode);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sampleRunRef = useRef(0);
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!debugEnabled) return;
    const runId = sampleRunRef.current + 1;
    sampleRunRef.current = runId;

    if (!isOpen) return;

    const samples: ProbeSample[] = [];
    const sampleFrame = (frame: number) => {
      if (sampleRunRef.current !== runId) return;
      const sample = readProbeSample({
        animationMode,
        css: mode,
        frame,
        maxHeightMode,
        modalMode,
        overlayMode,
        shell,
        trigger: triggerRef.current,
      });
      samples.push(sample);
      onDebugSamples([...samples]);

      if (frame < 8) {
        window.requestAnimationFrame(() => sampleFrame(frame + 1));
      } else {
        logProbeSamples(samples);
      }
    };

    window.setTimeout(() => sampleFrame(0), 0);
  }, [
    animationMode,
    debugEnabled,
    maxHeightMode,
    modalMode,
    mode,
    onDebugSamples,
    overlayMode,
    shell,
  ]);

  return (
    <Dropdown onOpenChange={handleOpenChange}>
      <Button ref={triggerRef} aria-label="Menu" variant="secondary">
        Fruit
      </Button>
      <Dropdown.Popover
        UNSTABLE_portalContainer={portalContainer}
        boundaryElement={boundaryElement}
        className="min-w-[256px]"
        isNonModal={usesNonModal(modalMode)}
        maxHeight={maxHeight}
      >
        <Dropdown.Menu
          selectedKeys={selected}
          selectionMode="single"
          onSelectionChange={setSelected}
        >
          <Dropdown.Section>
            <Header>Select a fruit</Header>
            {items.slice(0, 3).map((fruit) => (
              <Dropdown.Item
                id={fruit.toLowerCase()}
                key={fruit}
                textValue={fruit}
              >
                <Dropdown.ItemIndicator />
                <Label>{fruit}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
          {items.slice(3).map((fruit) => (
            <Dropdown.Item id={fruit.toLowerCase()} key={fruit} textValue={fruit}>
              <Dropdown.ItemIndicator />
              <Label>{fruit}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function BareProbeShell({ children }: { children: ReactNode }) {
  return (
    <main className="probe-page probe-page--bare">
      <div className="probe-spacer" />
      <div className="probe-target">{children}</div>
    </main>
  );
}

function ThemeProbeShell({ children }: { children: ReactNode }) {
  return (
    <main className="probe-page probe-page--theme">
      <div className="probe-spacer" />
      <div className="probe-target">{children}</div>
    </main>
  );
}

function Theme86ProbeShell({ children }: { children: ReactNode }) {
  return (
    <main className="probe-page probe-page--theme">
      <div className="probe-docs-content-spacer" />
      <div className="probe-target">{children}</div>
    </main>
  );
}

function RootStaticProbeShell({ children }: { children: ReactNode }) {
  return (
    <main className="probe-page probe-page--theme probe-page--app-root">
      <div className="probe-spacer" />
      <div className="probe-target">{children}</div>
    </main>
  );
}

function RootAbsoluteProbeShell({ children }: { children: ReactNode }) {
  return (
    <main className="probe-page probe-page--theme probe-page--app-root">
      <div className="probe-spacer" />
      <div className="probe-target">{children}</div>
    </main>
  );
}

function DocsFrame({
  children,
  sidebar = true,
  toc = true,
}: {
  children: ReactNode;
  sidebar?: boolean;
  toc?: boolean;
}) {
  return (
    <div className="probe-docs-shell">
      <a
        className="flex h-8 w-full items-center justify-center gap-1.5 bg-surface-secondary transition-colors hover:bg-surface-secondary/80"
        href="https://heroui.pro"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs leading-tight font-medium text-accent-foreground">
          Pro
        </span>
        <span className="hidden text-xs font-medium text-foreground sm:inline">
          Launch discount is live!
        </span>
      </a>
      <div
        className="grid min-h-(--fd-docs-height) auto-cols-auto auto-rows-auto overflow-x-clip transition-[grid-template-columns] [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-sidebar-width:0px] [--fd-toc-popover-height:0px] [--fd-toc-width:0px]"
        id="nd-notebook-layout"
        style={{
          ["--fd-docs-height" as string]: "calc(100dvh - 2rem)",
          ["--fd-docs-row-1" as string]: "var(--fd-banner-height, 0px)",
          ["--fd-docs-row-2" as string]:
            "calc(var(--fd-docs-row-1) + var(--fd-header-height))",
          ["--fd-docs-row-3" as string]:
            "calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))",
          ["--fd-layout-width" as string]: "97rem",
          ["--fd-sidebar-col" as string]: "var(--fd-sidebar-width)",
          gridTemplate:
            '". header header header ." ". sidebar toc-popover toc-popover ." ". sidebar main toc ." 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width, 97rem) - var(--fd-sidebar-col) - var(--fd-toc-width))) var(--fd-toc-width) minmax(min-content, 1fr)',
        }}
      >
        {sidebar ? (
          <div
            className="md:layout:[--fd-sidebar-width:268px] pointer-events-none sticky z-20 [grid-area:sidebar] *:pointer-events-auto max-md:hidden top-(--fd-docs-row-2) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))]"
            data-sidebar-placeholder=""
          >
            <aside className="probe-docs-sidebar" id="nd-sidebar">
              <p className="probe-docs-sidebar__heading">Overview</p>
              <a data-active="false" href="/docs/react/components">
                All Components
              </a>
              <p className="probe-docs-sidebar__heading">Components</p>
              <a data-active="false" href="/docs/react/components/button">
                Button
              </a>
              <a data-active="true" href="/docs/react/components/dropdown">
                Dropdown
              </a>
              <a data-active="false" href="/docs/react/components/popover">
                Popover
              </a>
            </aside>
          </div>
        ) : null}

        <main className="probe-docs-main" id="nd-page">
          {children}
        </main>

        {toc ? (
          <aside className="probe-docs-toc" id="nd-toc">
            <nav>
              <a data-active="true" href="#default">
                Default
              </a>
              <a data-active="false" href="#usage">
                Usage
              </a>
              <a data-active="false" href="#api">
                API
              </a>
            </nav>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function GridProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <div className="probe-docs-grid-surface">
        <div className="probe-spacer" />
        <div className="probe-docs-grid-target">{children}</div>
      </div>
    </DocsFrame>
  );
}

function GridCenteredProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <div className="probe-docs-grid-surface probe-docs-grid-surface--centered">
        <div className="probe-spacer" />
        <div className="probe-docs-grid-target">{children}</div>
      </div>
    </DocsFrame>
  );
}

function DocsHeading() {
  return (
    <div className="probe-docs-heading">
      <p>Components</p>
      <h1>Dropdown</h1>
      <p>
        A dropdown displays a list of actions or options that a user can choose.
      </p>
    </div>
  );
}

function DocsArticle({ children }: { children: ReactNode }) {
  return (
    <article className="probe-docs-article">
      <DocsHeading />
      <div aria-hidden="true" className="probe-docs-content-spacer" />
      {children}
      <div aria-hidden="true" className="probe-docs-trailing-spacer" />
    </article>
  );
}

function ArticlePlainProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <article className="probe-docs-article">
        <div className="probe-spacer" />
        <div className="probe-docs-article-target">{children}</div>
      </article>
    </DocsFrame>
  );
}

function ArticleProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <DocsArticle>
        <div className="probe-docs-article-target">{children}</div>
      </DocsArticle>
    </DocsFrame>
  );
}

function Grid86ProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <div className="probe-docs-grid-surface">
        <div className="probe-docs-content-spacer" />
        <div className="probe-docs-grid-target">{children}</div>
      </div>
    </DocsFrame>
  );
}

function GridFlowProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <div className="probe-docs-grid-surface">
        <DocsHeading />
        <div aria-hidden="true" className="probe-docs-content-spacer" />
        <div className="probe-docs-grid-target">{children}</div>
        <div aria-hidden="true" className="probe-docs-trailing-spacer" />
      </div>
    </DocsFrame>
  );
}

function GridFlow100ProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <div className="probe-docs-grid-surface">
        <DocsHeading />
        <div className="probe-spacer" />
        <div className="probe-docs-grid-target">{children}</div>
        <div aria-hidden="true" className="probe-docs-trailing-spacer" />
      </div>
    </DocsFrame>
  );
}

function GridFlowNoTrailingProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <div className="probe-docs-grid-surface">
        <DocsHeading />
        <div aria-hidden="true" className="probe-docs-content-spacer" />
        <div className="probe-docs-grid-target">{children}</div>
      </div>
    </DocsFrame>
  );
}

function PreviewContent({ children }: { children: ReactNode }) {
  return (
    <section className="component-preview-container probe-docs-preview-container">
      <div className="probe-docs-preview-header">
        <span>Default</span>
      </div>
      <div className="probe-docs-preview">
        <div className="probe-docs-preview-target">{children}</div>
      </div>
    </section>
  );
}

function PreviewProbeShell({ children }: { children: ReactNode }) {
  return (
    <main className="probe-docs-preview-page">
      <DocsArticle>
        <PreviewContent>{children}</PreviewContent>
      </DocsArticle>
    </main>
  );
}

function DocsProbeShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame>
      <DocsArticle>
        <PreviewContent>{children}</PreviewContent>
      </DocsArticle>
    </DocsFrame>
  );
}

export default function App() {
  const animationMode = initialAnimationMode();
  const mode = initialCssMode();
  const itemCount = initialItemCount();
  const shell = initialShellMode();
  const overlayMode = initialOverlayMode();
  const modalMode = initialModalMode();
  const maxHeightMode = initialMaxHeightMode();
  const debugEnabled = initialDebugEnabled();
  const stylesReady = useProbeStyles(mode, shell, animationMode);
  const [debugSamples, setDebugSamples] = useState<ProbeSample[]>([]);
  const handleDebugSamples = useCallback((samples: ProbeSample[]) => {
    setDebugSamples(samples);
  }, []);

  useEffect(() => {
    setDebugSamples([]);
  }, [
    animationMode,
    debugEnabled,
    itemCount,
    maxHeightMode,
    modalMode,
    mode,
    overlayMode,
    shell,
  ]);

  const probe = stylesReady ? (
    <DocsSingleSelectionDropdown
      animationMode={animationMode}
      debugEnabled={debugEnabled}
      itemCount={itemCount}
      maxHeightMode={maxHeightMode}
      modalMode={modalMode}
      mode={mode}
      onDebugSamples={handleDebugSamples}
      overlayMode={overlayMode}
      shell={shell}
    />
  ) : (
    <div className="probe-loading">Loading styles</div>
  );

  return (
    <>
      <ProbeToolbar
        animationMode={animationMode}
        debugEnabled={debugEnabled}
        itemCount={itemCount}
        maxHeightMode={maxHeightMode}
        modalMode={modalMode}
        mode={mode}
        overlayMode={overlayMode}
        shell={shell}
      />
      {debugEnabled && <DebugPanel samples={debugSamples} />}
      {shell === "docs" && <DocsProbeShell>{probe}</DocsProbeShell>}
      {shell === "preview" && <PreviewProbeShell>{probe}</PreviewProbeShell>}
      {shell === "article" && <ArticleProbeShell>{probe}</ArticleProbeShell>}
      {shell === "article-plain" && (
        <ArticlePlainProbeShell>{probe}</ArticlePlainProbeShell>
      )}
      {shell === "grid-flow" && <GridFlowProbeShell>{probe}</GridFlowProbeShell>}
      {shell === "grid-flow-100" && (
        <GridFlow100ProbeShell>{probe}</GridFlow100ProbeShell>
      )}
      {shell === "grid-flow-no-trailing" && (
        <GridFlowNoTrailingProbeShell>{probe}</GridFlowNoTrailingProbeShell>
      )}
      {shell === "grid-86" && <Grid86ProbeShell>{probe}</Grid86ProbeShell>}
      {shell === "grid-centered" && (
        <GridCenteredProbeShell>{probe}</GridCenteredProbeShell>
      )}
      {shell === "grid" && <GridProbeShell>{probe}</GridProbeShell>}
      {shell === "theme-86" && <Theme86ProbeShell>{probe}</Theme86ProbeShell>}
      {shell === "theme" && <ThemeProbeShell>{probe}</ThemeProbeShell>}
      {shell === "root-static" && (
        <RootStaticProbeShell>{probe}</RootStaticProbeShell>
      )}
      {shell === "root-absolute" && (
        <RootAbsoluteProbeShell>{probe}</RootAbsoluteProbeShell>
      )}
      {shell === "bare" && <BareProbeShell>{probe}</BareProbeShell>}
    </>
  );
}
