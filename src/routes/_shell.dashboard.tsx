import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SimNote } from "@/components/vv/primitives";

export const Route = createFileRoute("/_shell/dashboard")({
  
  head: () => ({ meta: [{ title: "Welcome back, explorer! · VidyaVerse" }, { name: "description", content: "Welcome back, explorer! in the VidyaVerse prototype." }, { property: "og:title", content: "Welcome back, explorer! · VidyaVerse" }, { property: "og:description", content: "Welcome back, explorer! in the VidyaVerse prototype." }] }),
  component: () => (
    <div>
      <PageHeader title="Welcome back, explorer!" />
      <SimNote>This page is not built yet in the prototype.</SimNote>
    </div>
  ),
});
