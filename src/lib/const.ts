import { Project, List, Task, TaskStatus, TaskPriority } from "@/lib/types";
import { v4 as uuid } from "uuid";

const makeTask = (
  title: string,
  description: string,
  status: TaskStatus,
  priority: TaskPriority,
  assignedUser?: string,
  dueDate?: string
): Task => ({
  id: uuid(),
  title,
  description,
  status,
  priority,
  assignedUser,
  dueDate,
});

const makeList = (title: string, tasks: Task[], imageUrl?: string): List => ({
  id: uuid(),
  title,
  tasks,
  imageUrl,
});

export const mockProjects: Project[] = [
  {
    id: uuid(),
    title: "Website Redesign",
    description:
      "Overhaul company website for new branding and mobile responsiveness.",
    coverImage: "https://placehold.co/600x300",
    lists: [
      makeList(
        "Backlog",
        [
          makeTask(
            "Create wireframes",
            "Sketch homepage wireframes",
            "done",
            "Medium"
          ),
          makeTask(
            "Define color palette",
            "Select primary/secondary colors",
            "done",
            "Low"
          ),
          makeTask(
            "Setup analytics",
            "Integrate Google Analytics and Hotjar",
            "todo",
            "Medium"
          ),
        ],
        "https://placehold.co/300x200"
      ),
      makeList("In Progress", [
        makeTask(
          "Implement header",
          "Navbar and logo",
          "in-progress",
          "High",
          "alice@example.com",
          "2025-05-01"
        ),
        makeTask(
          "Responsive testing",
          "Ensure design works across devices",
          "in-progress",
          "Medium"
        ),
      ]),
      makeList("Done", [
        makeTask("Project kickoff", "Initial team meeting", "done", "High"),
        makeTask(
          "Content audit",
          "Review all current pages and assets",
          "done",
          "Low"
        ),
      ]),
    ],
  },
  {
    id: uuid(),
    title: "Mobile App Launch",
    description: "Develop and launch the new mobile application.",
    coverImage: "https://placehold.co/600x300",
    lists: [
      makeList("Backlog", [
        makeTask("Design app icon", "Create branded icon", "todo", "Medium"),
        makeTask(
          "Setup CI/CD",
          "Configure deployment pipeline",
          "todo",
          "High"
        ),
        makeTask(
          "Push notification setup",
          "Enable FCM/APNs integration",
          "todo",
          "High"
        ),
      ]),
      makeList("Review", [
        makeTask(
          "UX review",
          "Collect feedback on prototypes",
          "in-progress",
          "Low",
          "bob@example.com"
        ),
      ]),
      makeList(
        "Released",
        [
          makeTask(
            "Publish v1.0",
            "Push to App Store and Play Store",
            "done",
            "High"
          ),
        ],
        "https://placehold.co/300x200"
      ),
    ],
  },
  {
    id: uuid(),
    title: "Content Marketing Strategy",
    description:
      "Plan and execute a quarterly content strategy for SEO and engagement.",
    coverImage: "https://placehold.co/600x300",
    lists: [
      makeList("Ideas", [
        makeTask(
          "Blog post topics",
          "Brainstorm 10 blog ideas",
          "done",
          "Medium"
        ),
        makeTask("Guest post outreach", "Find partner websites", "done", "Low"),
      ]),
      makeList("Content Production", [
        makeTask(
          "Write blog post on AI trends",
          "Draft + edit by team",
          "in-progress",
          "High",
          "maria@example.com"
        ),
        makeTask(
          "Design social graphics",
          "Create templates for LinkedIn posts",
          "in-progress",
          "Medium"
        ),
      ]),
      makeList("Published", [
        makeTask(
          "Launch newsletter #1",
          "Send to mailing list",
          "done",
          "Medium"
        ),
      ]),
    ],
  },
  {
    id: uuid(),
    title: "Internal Tool Development",
    description: "Build an internal dashboard for analytics and operations.",
    coverImage: "https://placehold.co/600x300",
    lists: [
      makeList("Planning", [
        makeTask(
          "Gather requirements",
          "Interview ops and finance",
          "done",
          "High"
        ),
        makeTask(
          "Tech stack decisions",
          "Choose frameworks and DB",
          "done",
          "Medium"
        ),
      ]),
      makeList("Development", [
        makeTask(
          "Login system",
          "OAuth integration with company SSO",
          "in-progress",
          "High"
        ),
        makeTask(
          "Dashboard UI",
          "Initial layout and chart components",
          "in-progress",
          "Medium"
        ),
      ]),
      makeList("Completed", [
        makeTask("Sprint 0 setup", "Create repo, setup CI", "done", "High"),
      ]),
    ],
  },
];
