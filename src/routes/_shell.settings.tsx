import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SimNote } from "@/components/vv/primitives";

export const Route = createFileRoute("/_shell/settings")({
  
  head: () => ({ meta: [{ title: "Settings · VidyaVerse" }, { name: "description", content: "Settings in the VidyaVerse prototype." }, { property: "og:title", content: "Settings · VidyaVerse" }, { property: "og:description", content: "Settings in the VidyaVerse prototype." }] }),
  component: () => (
    <div>
      <PageHeader title="Settings" />
      <SimNote>This page is not built yet in the prototype.</SimNote>
    </div>
  ),
});
