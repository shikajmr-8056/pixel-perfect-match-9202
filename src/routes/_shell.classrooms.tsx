import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SimNote } from "@/components/vv/primitives";

export const Route = createFileRoute("/_shell/classrooms")({
  
  head: () => ({ meta: [{ title: "Classrooms · VidyaVerse" }, { name: "description", content: "Classrooms in the VidyaVerse prototype." }, { property: "og:title", content: "Classrooms · VidyaVerse" }, { property: "og:description", content: "Classrooms in the VidyaVerse prototype." }] }),
  component: () => (
    <div>
      <PageHeader title="Classrooms" />
      <SimNote>This page is not built yet in the prototype.</SimNote>
    </div>
  ),
});
