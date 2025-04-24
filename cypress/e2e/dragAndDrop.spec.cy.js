import "@4tw/cypress-drag-drop"; // install via `npm i -D @4tw/cypress-drag-drop`

describe("Drag & Drop Tasks", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/"); 
  });

  it("moves a task from one list to another", () => {
    // assume lists have data-listid attributes
    cy.get("[data-listid]").eq(0).as("fromList");
    cy.get("[data-listid]").eq(1).as("toList");

    cy.get("@fromList")
      .find("[data-testid=task-card]")
      .first()
      .as("task");

    cy.get("@task").drag("@toList");

    // after drop, it should no longer exist in the first list
    cy.get("@fromList")
      .find("[data-testid=task-card]")
      .should("not.contain", Cypress._.firstName);

    // and should appear in the second list
    cy.get("@toList")
      .find("[data-testid=task-card]")
      .first()
      .should("exist");
  });
});
