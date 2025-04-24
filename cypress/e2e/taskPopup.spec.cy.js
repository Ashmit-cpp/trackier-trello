describe("Task Popup", () => {
  beforeEach(() => {
    // ensure a task exists
    cy.login(); // custom command that logs in via UI or programmatically
    cy.visit("/");
  });

  it("opens and closes the TaskPopup", () => {
    // click the first task card
    cy.get("[data-testid=task-card]").first().click();
    // modal/dialog should appear
    cy.get("[role=dialog]").should("be.visible");
    cy.contains("Status:").should("exist");
    // close it
    cy.get("[role=dialog] button").contains("Close").click();
    cy.get("[role=dialog]").should("not.exist");
  });
});
