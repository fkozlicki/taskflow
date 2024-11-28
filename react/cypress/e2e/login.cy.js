context("Login Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/sign-in");
  });

  it("Should render Sign in Form", () => {
    cy.get("h2").should("have.text", "Welcome back");

    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");
    cy.get('button[type="submit"]').should("exist").and("have.text", "Sign In");
  });

  it("Should redirect to Sign up page", () => {
    cy.get("a[href='/sign-up']").click();

    cy.location("pathname").should("eq", "/sign-up");
  });

  it("Should redirect to Home page", () => {
    cy.get("a[href='/']").click();

    cy.location("pathname").should("eq", "/");
  });

  it("Should redirect to Dashboard after successful login", () => {
    cy.get('input[type="email"]').type("johndoe@gmail.com");
    cy.get('input[type="password"]').type("secret");
    cy.get('button[type="submit"]').click();

    cy.location("pathname").should("eq", "/dashboard");
  });
});
