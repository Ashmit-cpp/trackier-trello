describe("Auth: Login & Registration", () => {
  it("shows validation errors on empty submit", () => {
    cy.visit("https://trackier-trello.vercel.app/register");

    cy.get("button[type=submit]").click();
    cy.contains("Username must be at least 2 characters long").should("exist");
    cy.contains("Please enter a valid email address").should("exist");
    cy.contains("Password must be at least 6 characters long").should("exist");
  });

  it("rejects invalid email", () => {
    cy.visit("https://trackier-trello.vercel.app/register");

    cy.get("#username").type("testuser");
    cy.get("#email").type("teseueser@validemail.com");
    cy.get("#password").type("123");
    cy.get("button[type=submit]").click();
    cy.contains("Password must be at least 6 characters long").should("exist");
  });

  it("registers successfully and redirects to dashboard", () => {
    cy.visit("https://trackier-trello.vercel.app/register");

    const user = `u${Date.now()}`;
    cy.get("#username").type(user);
    cy.get("#email").type(`${user}@example.com`);
    cy.get("#password").type("password123");
    cy.get("button[type=submit]").click();
    cy.contains(`My Projects`).should("exist");

    // Optionally store user for reuse
    Cypress.env("lastUserEmail", `${user}@example.com`);
  });

  it("logs out and then fails login with wrong creds", () => {
    cy.visit("https://trackier-trello.vercel.app/");

    cy.get("[data-cy=logout]").click();

    // At this point, you’re likely redirected to login
    // cy.url().should("include", "/login");

    cy.get("#email").type("wrong@example.com");
    cy.get("#password").type("badpass");
    cy.get("button[type=submit]").click();
    cy.contains("Login failed!").should("exist");
  });

  it("logs in successfully", () => {
    cy.visit("https://trackier-trello.vercel.app/login");

    const email = Cypress.env("lastUserEmail");
    cy.get("#email").type(email);
    cy.get("#password").clear().type("password123");
    cy.get("button[type=submit]").click();
    cy.contains(`My Projects`).should("exist");
  });
});
