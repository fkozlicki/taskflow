import { http, HttpResponse } from "msw";
import { session } from "./data/session.ts";
import { milestones } from "./data/milestones.ts";

export const handlers = [
  http.get("**/milestones", () => {
    return HttpResponse.json(milestones);
  }),
  http.get("*/auth/session", () => {
    return HttpResponse.json(session);
  }),
  http.get("*/users", () => {
    return HttpResponse.json({});
  }),
];
