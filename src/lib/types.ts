// src/types.ts
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedUser?: string;
  dueDate?: string;
}

export interface List {
  id: string;
  title: string;
  imageUrl?: string;      
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
