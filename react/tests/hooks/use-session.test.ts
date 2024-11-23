import { renderHook, waitFor } from "@testing-library/react";
import { useSession } from "@/hooks/queries/use-session.ts";
import { createWrapper } from "../utils.tsx";

describe("useSession", () => {
  it("should return empty object", async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.name).toBe("John Doe");
    });
  });
});
