describe("Auth: Login & Registration", () => {
  beforeEach(() => {
    cy.visit("https://trackier-trello.vercel.app/register");
  });

  it("shows validation errors on empty submit", () => {
    cy.get("button[type=submit]").click();
    cy.contains("Username is required").should("exist");
    cy.contains("Email is required").should("exist");
    cy.contains("Password is required").should("exist");
  });

  it("rejects invalid email", () => {
    cy.get("#username").type("testuser");
    cy.get("#email").type("not-an-email");
    cy.get("#password").type("password123");
    cy.get("button[type=submit]").click();
    cy.contains("Invalid email").should("exist");
  });

  it("registers successfully and redirects to dashboard", () => {
    const user = `u${Date.now()}`;
    cy.get("#username").type(user);
    cy.get("#email").type(`${user}@example.com`);
    cy.get("#password").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains(`Welcome, ${user}`).should("exist");
  });

  it("logs out and then fails login with wrong creds", () => {
    // assume already registered from previous test
    cy.contains("Logout").click();
    cy.url().should("include", "/login");

    cy.get("#email").type("wrong@example.com");
    cy.get("#password").type("badpass");
    cy.get("button[type=submit]").click();
    cy.contains("Invalid credentials").should("exist");
  });

  it("logs in successfully", () => {
    // re-use the user created above
    const email = Cypress.env("lastUserEmail");
    cy.get("#email").clear().type(email);
    cy.get("#password").clear().type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });
});
