import { Milestone } from "@/hooks/queries/use-milestones.ts";

export const milestones: Milestone[] = [
  {
    id: crypto.randomUUID(),
    done: true,
    content: "Build an API using Express.js",
  },
  {
    id: crypto.randomUUID(),
    done: true,
    content: "Design the app UI",
  },
  {
    id: crypto.randomUUID(),
    done: true,
    content: "Create web app using React",
  },
  {
    id: crypto.randomUUID(),
    done: true,
    content: "Do the marketing stuff",
  },
];
