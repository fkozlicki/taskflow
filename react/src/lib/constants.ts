export const columns = [
  { color: "#149eff", id: "todo", label: "To Do" },
  { color: "#ffa015", id: "in-progress", label: "In Progress" },
  { color: "#6850fe", id: "in-review", label: "In Review" },
  { color: "#15ff8e", id: "done", label: "Done" },
];

export type Column = (typeof columns)[number];
