// src/context/ProjectContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbGet, dbSet } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { Project } from '@/lib/types';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  createProject: (title: string, description: string, coverImage?: string) => void;
  createList: (projectId: string, listTitle: string) => void;
  createTask: (
    projectId: string,
    listId: string,
    title: string,
    description: string,
    assignedUser?: string,
    dueDate?: string
  ) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved projects (with lists/tasks) from IndexedDB
  useEffect(() => {
    (async () => {
      const saved = await dbGet('projects', 'all');
      if (saved) setProjects(saved as Project[]);
      setLoading(false);
    })();
  }, []);

  // Persist any changes once initial load is done
  useEffect(() => {
    if (!loading) {
      dbSet('projects', 'all', projects);
    }
  }, [projects, loading]);

  const createProject = (title: string, description: string, coverImage?: string) => {
    setProjects(ps => [
      ...ps,
      { id: uuid(), title, description, coverImage, lists: [] }
    ]);
  };

  const createList = (projectId: string, listTitle: string) => {
    setProjects(ps =>
      ps.map(proj =>
        proj.id === projectId
          ? {
              ...proj,
              lists: [
                ...proj.lists,
                { id: uuid(), title: listTitle, tasks: [] }
              ]
            }
          : proj
      )
    );
  };

  const createTask = (
    projectId: string,
    listId: string,
    title: string,
    description: string,
    assignedUser?: string,
    dueDate?: string
  ) => {
    setProjects(ps =>
      ps.map(proj =>
        proj.id === projectId
          ? {
              ...proj,
              lists: proj.lists.map(list =>
                list.id === listId
                  ? {
                      ...list,
                      tasks: [
                        ...list.tasks,
                        { id: uuid(), title, description, assignedUser, dueDate }
                      ]
                    }
                  : list
              )
            }
          : proj
      )
    );
  };

  if (loading) {
    return <div>Loading projects…</div>;
  }

  return (
    <ProjectContext.Provider
      value={{ projects, loading, createProject, createList, createTask }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
