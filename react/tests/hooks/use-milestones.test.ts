import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../utils.tsx";
import { useMilestones } from "@/hooks/queries/use-milestones.ts";
import { expect } from "vitest";
import { milestones } from "../data/milestones.ts";

describe("useSession", () => {
  it("should return empty object", async () => {
    const { result } = renderHook(() => useMilestones("anyId"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);

      expect(result.current.data).toStrictEqual(milestones);
    });
  });
});
