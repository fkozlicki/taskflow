context("Kanban Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/projects/*/tasks");

    cy.intercept(
      {
        method: "GET",
        url: "/api/auth/session",
      },
      { fixture: "user.json" },
    );

    cy.intercept(
      {
        method: "GET",
        url: "/api/projects",
      },
      { fixture: "projects.json" },
    ).as("getProjects");

    cy.intercept(
      {
        method: "GET",
        url: "/api/projects/*",
      },
      { fixture: "project-taskflow.json" },
    ).as("getProject");
  });

  it("Should render projects grid skeleton", () => {
    cy.get("#projects-grid-skeleton").should("exist");
    cy.wait("@getProjects");
  });
});
