import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SimNote } from "@/components/vv/primitives";

export const Route = createFileRoute("/_shell/learn")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({ meta: [{ title: "Learning library · VidyaVerse" }, { name: "description", content: "Learning library in the VidyaVerse prototype." }, { property: "og:title", content: "Learning library · VidyaVerse" }, { property: "og:description", content: "Learning library in the VidyaVerse prototype." }] }),
  component: () => (
    <div>
      <PageHeader title="Learning library" />
      <SimNote>This page is not built yet in the prototype.</SimNote>
    </div>
  ),
});
