import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Project, Task, List, TaskStatus, TaskPriority } from "@/lib/types";
import { dbGet, dbSet } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { useAuth } from "./AuthContext";
import { mockProjects } from "@/lib/const";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  createProject: (
    title: string,
    description: string,
    coverImage?: string
  ) => void;
  createList: (projectId: string, listTitle: string, imageUrl?: string) => void;
  deleteList: (projectId: string, listId: string) => void;
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
  deleteTask: (projectId: string, listId: string, taskId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const saved = await dbGet("projects", "all");
      if (saved) setProjects(saved as Project[]);
      setLoading(false);
    })();
  }, []);

  // Persist changes
  useEffect(() => {
    if (!loading) {
      dbSet("projects", "all", projects);
    }
  }, [projects, loading]);

  // Seed mock data on first login
  useEffect(() => {
    if (!loading && user && projects.length === 0) {
      setProjects(mockProjects);
    }
  }, [user, loading, projects.length]);

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

  const createList = (
    projectId: string,
    listTitle: string,
    imageUrl?: string
  ) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId
          ? {
              ...p,
              lists: [
                ...p.lists,
                { id: uuid(), title: listTitle, imageUrl, tasks: [] },
              ],
            }
          : p
      )
    );
  };

  const deleteList = (projectId: string, listId: string) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId
          ? { ...p, lists: p.lists.filter((l) => l.id !== listId) }
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

  const deleteTask = (projectId: string, listId: string, taskId: string) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId
          ? {
              ...p,
              lists: p.lists.map((l) =>
                l.id === listId
                  ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) }
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
        deleteList,
        createTask,
        moveTask,
        updateTask,
        deleteTask,
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
