// src/context/ProjectContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Project, Task, List, TaskStatus, TaskPriority } from "@/lib/types";
import { dbGet, dbSet } from "@/lib/db";
import { v4 as uuid } from "uuid";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  createProject: (
    title: string,
    description: string,
    coverImage?: string
  ) => void;
  createList: (projectId: string, listTitle: string) => void;
  createTask: (
    projectId: string,
    listId: string,
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    assignedUser?: string,
    dueDate?: string
  ) => void;
  moveTask: (
    projectId: string,
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  updateTask: (
    projectId: string,
    listId: string,
    taskId: string,
    updates: Partial<Omit<Task, "id">>
  ) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from IndexedDB
  useEffect(() => {
    (async () => {
      const saved = await dbGet("projects", "all");
      if (saved) setProjects(saved as Project[]);
      setLoading(false);
    })();
  }, []);

  // Persist to IndexedDB
  useEffect(() => {
    if (!loading) {
      dbSet("projects", "all", projects);
    }
  }, [projects, loading]);

  const createProject = (
    title: string,
    description: string,
    coverImage?: string
  ) => {
    setProjects((ps) => [
      ...ps,
      { id: uuid(), title, description, coverImage, lists: [] },
    ]);
  };

  const createList = (projectId: string, listTitle: string) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId
          ? {
              ...p,
              lists: [...p.lists, { id: uuid(), title: listTitle, tasks: [] }],
            }
          : p
      )
    );
  };

  const createTask = (
    projectId: string,
    listId: string,
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    assignedUser?: string,
    dueDate?: string
  ) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId
          ? {
              ...p,
              lists: p.lists.map((l) =>
                l.id === listId
                  ? {
                      ...l,
                      tasks: [
                        ...l.tasks,
                        {
                          id: uuid(),
                          title,
                          description,
                          status,
                          priority,
                          assignedUser,
                          dueDate,
                        },
                      ],
                    }
                  : l
              ),
            }
          : p
      )
    );
  };

  const moveTask = (
    projectId: string,
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => {
    setProjects((ps) =>
      ps.map((p) => {
        if (p.id !== projectId) return p;
        const listsCopy: List[] = p.lists.map((l) => ({
          ...l,
          tasks: [...l.tasks],
        }));
        const sourceList = listsCopy.find((l) => l.id === sourceListId)!;
        const [moved] = sourceList.tasks.splice(sourceIndex, 1);
        const destList = listsCopy.find((l) => l.id === destListId)!;
        destList.tasks.splice(destIndex, 0, moved);
        return { ...p, lists: listsCopy };
      })
    );
  };

  const updateTask = (
    projectId: string,
    listId: string,
    taskId: string,
    updates: Partial<Omit<Task, "id">>
  ) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId
          ? {
              ...p,
              lists: p.lists.map((l) =>
                l.id === listId
                  ? {
                      ...l,
                      tasks: l.tasks.map((t) =>
                        t.id === taskId ? { ...t, ...updates } : t
                      ),
                    }
                  : l
              ),
            }
          : p
      )
    );
  };

  if (loading) {
    return <div>Loading projects…</div>;
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        createProject,
        createList,
        createTask,
        moveTask,
        updateTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
  return ctx;
}
