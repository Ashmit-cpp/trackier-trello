// cypress/e2e/creation.spec.cy.ts

describe("ProjectPage – Create New Project, List & Task", () => {
  const projectName = "My New Cypress Project";
  const listName = "Cypress To-Do List";
  const taskTitle = "Write tests";
  const taskDesc = "Ensure all flows are covered";
  const taskUser = "alice@example.com";

  beforeEach(() => {
    cy.visit("https://trackier-trello.vercel.app/");

    // --- Create & open a new project ---
    cy.get("[data-cy=add-project]").click();
    cy.get("#proj-title").type(projectName);
    cy.get("#proj-desc").type("This project was created by Cypress");
    cy.get("#proj-cover").clear().type("https://example.com/cover.png");
    cy.contains("button", "Create").click();

    cy.get("[data-cy=sidebar-project]").contains(projectName).click();
    cy.url().should("match", /\/project\/[A-Za-z0-9_-]+$/);
  });

  it("adds a new list and a task inside it", () => {
    // --- Add New List ---
    cy.contains("button", "Add New List").click();
    cy.get('input[placeholder="List title"]').type(listName);
    cy.contains("button", "Create List").click();

    // Assert the list header appears as an <h2>
    cy.contains("h2", listName).should("be.visible");

    // --- Add Task to that List ---
    // Find the list’s wrapper (it lives in a div.space-y-4) and click its “Add Task”
    cy.contains("h2", listName)
      .closest("div.space-y-4")
      .within(() => {
        cy.contains("button", "Add Task").click();
      });

    // Fill out the task form
    cy.get('input[placeholder="Task title"]').type(taskTitle);
    cy.get('input[placeholder="Optional details"]').type(taskDesc);
    cy.get('input[placeholder="Username or email"]').type(taskUser);

    // Status → To Do
    cy.get("[data-cy=select-status]").click();
    cy.get('[role="option"]').contains("To Do").click();

    // Priority → Medium
    cy.get("[data-cy=select-priority]").click();
    cy.get('[role="option"]').contains("Medium").click();

    // Submit task
    cy.contains("button", "Create Task").click();

    // --- Assert the new task renders under the right list ---
    cy.contains("h2", listName)
      .closest("div.space-y-4")
      .within(() => {
        // Task title, description, user
        cy.contains(taskTitle).should("be.visible");
        cy.contains(taskDesc).should("be.visible");
        cy.contains(taskUser).should("be.visible");

        // Status and priority badges
        cy.contains(/^To Do$/).should("be.visible");
        cy.contains(/^Medium$/).should("be.visible");
      });
  });
});
