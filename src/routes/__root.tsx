import { useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function HeadManager() {
  // Aggregate `head()` results from every matched route and apply them to <head>.
  // Mirrors what HeadContent does on the server, but client-side only.
  const matches = useRouterState({ select: (s) => s.matches });

  useEffect(() => {
    const merged: { meta: Record<string, string>; title?: string } = { meta: {} };

    for (const m of matches) {
      const head = (m as unknown as { meta?: { title?: string; meta?: Array<Record<string, string>> } }).meta
        ?? (m as unknown as { headValue?: { title?: string; meta?: Array<Record<string, string>> } }).headValue;

      const headFn = (m.routeId && (m as unknown as { staticData?: unknown }).staticData) as unknown;
      void headFn;

      const headObj = (m as unknown as { __routeContext?: unknown });
      void headObj;

      // The router stores resolved head() as `m.meta` (array of meta entries) in newer versions
      // and as `m.head` in others. We read whichever is present.
      const rawHead =
        (m as unknown as { head?: { meta?: Array<Record<string, string>> } }).head ??
        (head as { meta?: Array<Record<string, string>> } | undefined);

      const metaList = Array.isArray((rawHead as { meta?: unknown })?.meta)
        ? ((rawHead as { meta: Array<Record<string, string>> }).meta)
        : Array.isArray((m as unknown as { meta?: Array<Record<string, string>> }).meta)
          ? (m as unknown as { meta: Array<Record<string, string>> }).meta
          : [];

      for (const tag of metaList) {
        if (!tag) continue;
        if (tag.title) {
          merged.title = tag.title;
          continue;
        }
        const key = tag.name ? `name:${tag.name}` : tag.property ? `property:${tag.property}` : null;
        if (key && tag.content !== undefined) merged.meta[key] = tag.content;
      }
    }

    if (merged.title) document.title = merged.title;

    for (const [key, content] of Object.entries(merged.meta)) {
      const [kind, name] = key.split(":");
      const selector = kind === "name" ? `meta[name="${name}"]` : `meta[property="${name}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        if (kind === "name") el.setAttribute("name", name);
        else el.setAttribute("property", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }
  }, [matches]);

  return null;
}

function RootComponent() {
  return (
    <>
      <HeadManager />
      <Outlet />
    </>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
