// cypress/e2e/reorderWithinList.spec.cy.js

describe("ProjectPage — reorder within a single list", () => {
  const projectName = "My Direct DnD Test Project";
  const listName = "Reorder List";

  beforeEach(() => {
    // inject our test-hook before React loads
    cy.visit("https://trackier-trello.vercel.app/", {
      onBeforeLoad(win) {
        win.exposeForTesting = {};
      },
    });

    // 1️⃣ Create & open project
    cy.get("[data-cy=add-project]").click();
    cy.get("#proj-title").type(projectName);
    cy.get("#proj-desc").type("for reorder test");
    cy.contains("button", "Create").click();
    cy.get("[data-cy=sidebar-project]").contains(projectName).click();
    cy.url().should("match", /\/project\/[A-Za-z0-9_-]+$/);

    // 2️⃣ Create a single list
    cy.contains("button", "Add New List").click();
    cy.get('input[placeholder="List title"]').type(listName);

    cy.contains("button", "Create List").click();

    // 3️⃣ Add two tasks
    addTask(listName, "First", "A", "a@a.com", "To Do", "Low");
    addTask(listName, "Second", "B", "b@b.com", "To Do", "High");
  });

  it("moves 'Second' above 'First' via direct onDragEnd()", () => {
    // wait for the React hook to expose onDragEnd
    cy.window()
      .its("exposeForTesting.onDragEnd")
      .should("be.a", "function")
      .then((onDragEnd) => {
        // grab our listId and taskId
        cy.get('[data-cy-list-title="Reorder List"]')
          .invoke("attr", "data-droppable-id")
          .then((listId) => {
            cy.get('[data-cy-task-title="Second"]')
              .invoke("attr", "data-draggable-id")
              .then((taskId) => {
                // call the real dnd handler
                onDragEnd({
                  draggableId: taskId,
                  type: "DEFAULT",
                  source: { droppableId: listId, index: 1 },
                  destination: { droppableId: listId, index: 0 },
                  reason: "DROP",
                });

                // give React a moment to re-render
                cy.wait(200);

                // assert that 'Second' is now the first card
                cy.get('[data-cy-list-title="Reorder List"] [data-cy=task]')
                  .first()
                  .should("contain", "Second");
              });
          });
      });
  });

  // helper to add a task to a named list
  function addTask(listName, title, desc, user, status, priority) {
    // scope into the correct list
    cy.contains("h2", listName)
      .closest("div.space-y-4")
      .within(() => {
        cy.contains("button", "Add Task").click();
      });

    // fill out form
    cy.get('input[placeholder="Task title"]').type(title);
    cy.get('input[placeholder="Optional details"]').type(desc);
    cy.get('input[placeholder="Username or email"]').type(user);

    // Status
    cy.get("[data-cy=select-status]").click();
    cy.get('[role="option"]').contains(status).click();

    // Priority
    cy.get("[data-cy=select-priority]").click();
    cy.get('[role="option"]').contains(priority).click();

    // submit
    cy.contains("button", "Create Task").click();
  }
});
