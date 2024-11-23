import { render, screen } from "@testing-library/react";
import App from "@/App.tsx";
import { createWrapper } from "./utils.tsx";

describe("App", () => {
  it("renders the App component", () => {
    render(<App />, {
      wrapper: createWrapper(),
    });

    screen.debug();
  });
});
