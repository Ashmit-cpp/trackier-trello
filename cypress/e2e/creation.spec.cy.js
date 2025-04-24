describe("Project & Task Creation", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("creates a new project", () => {
    cy.get("button").contains("Add New Project").click();
    cy.get("#proj-title").type("Test Project X");
    cy.get("#proj-desc").type("A test project");
    cy.get("#proj-cover").type("https://placehold.co/600x300");
    cy.get("button[type=submit]").contains("Create").click();

    // sidebar shows new project
    cy.get(".sidebar-menu-button").contains("Test Project X").should("exist");
  });

  it("creates a new list and task inside it", () => {
    // use the project just created
    cy.get(".sidebar-menu-button").contains("Test Project X").click();
    cy.get("button").contains("Add New List").click();
    cy.get("#list-title").type("QA List");
    cy.get("#list-image").type("https://placehold.co/300x200");
    cy.get("button[type=submit]").contains("Create").click();

    // list column appears
    cy.contains("QA List").should("exist");

    // add a task
    cy.contains("QA List")
      .parent()
      .within(() => cy.get("button").contains("Add Task").click());

    cy.get("#task-title").type("Verify login");
    cy.get("#task-desc").type("Ensure login works");
    cy.get("#task-assigned").type("qa@example.com");
    cy.get("#task-due").type("2025-06-01");
    cy.get("button[type=submit]").contains("Create").click();

    // task card should appear
    cy.contains("Verify login").should("exist");
    cy.contains("2025-06-01").should("exist");
    cy.contains("qa@example.com").should("exist");
  });
});
