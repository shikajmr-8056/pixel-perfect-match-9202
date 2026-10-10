import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SimNote } from "@/components/vv/primitives";

export const Route = createFileRoute("/_shell/progress")({
  
  head: () => ({ meta: [{ title: "My Progress · VidyaVerse" }, { name: "description", content: "My Progress in the VidyaVerse prototype." }, { property: "og:title", content: "My Progress · VidyaVerse" }, { property: "og:description", content: "My Progress in the VidyaVerse prototype." }] }),
  component: () => (
    <div>
      <PageHeader title="My Progress" />
      <SimNote>This page is not built yet in the prototype.</SimNote>
    </div>
  ),
});
