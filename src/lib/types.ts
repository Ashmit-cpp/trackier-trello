// src/types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedUser?: string;
  dueDate?: string;
}

export interface List {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  lists: List[];
}

export interface User {
  username?: string;
  email: string;
  password: string;
}
