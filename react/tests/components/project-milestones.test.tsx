import { render, screen, waitFor } from "@testing-library/react";
import ProjectMilestones from "@/components/project-milestones.tsx";
import { createWrapper } from "../utils.tsx";
import { milestones } from "../data/milestones.ts";
import { server } from "../setup.ts";
import { http, HttpResponse } from "msw";

describe("ProjectMilestones", () => {
  it("Should render list of milestones", async () => {
    render(<ProjectMilestones />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      milestones.forEach((milestone) => {
        expect(screen.getByText(milestone.content)).toBeInTheDocument();
      });
    });
  });

  it("Should render error message if request failed", async () => {
    server.use(
      http.get("*/milestones", () => {
        return new HttpResponse(null, { status: 403 });
      }),
    );

    render(<ProjectMilestones />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      milestones.forEach((milestone) => {
        expect(screen.queryByText(milestone.content)).not.toBeInTheDocument();
      });
    });
  });
});
