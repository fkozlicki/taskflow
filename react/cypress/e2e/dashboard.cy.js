context("Dashboard Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/dashboard");

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
  });

  it("Should render projects grid skeleton", () => {
    cy.get("#projects-grid-skeleton").should("exist");
    cy.wait("@getProjects");
  });

  it("Should render projects grid", () => {
    cy.wait("@getProjects");
    cy.get("#projects-grid-skeleton").should("not.exist");
    cy.get("#projects-grid").should("exist");
    cy.get("#projects-grid > a").should("contain.text", "Taskflow");
    cy.get("#projects-grid > a").should("contain.text", "CodeCareers");
  });

  it("Should redirect to project page on card click", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/api/projects/*",
      },
      { fixture: "project-taskflow.json" },
    ).as("getProject");

    cy.intercept(
      {
        method: "GET",
        url: "/api/projects/*/milestones",
      },
      { fixture: "milestones-taskflow.json" },
    ).as("getMilestones");

    cy.wait("@getProjects");
    cy.get("#projects-grid > a").first().click();

    cy.location("pathname").should("match", /\/projects\/\w+/);
  });
});
