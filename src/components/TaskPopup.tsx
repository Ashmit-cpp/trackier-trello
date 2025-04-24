// src/components/TaskPopup.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProjects } from "@/context/ProjectContext";
import { Task, TaskStatus, TaskPriority } from "@/lib/types";
import { Label } from "./ui/label";

interface TaskPopupProps {
  projectId: string;
  listId: string;
  task: Task;
  open: boolean;
  onClose: () => void;
}

export function TaskPopup({
  projectId,
  listId,
  task,
  open,
  onClose,
}: TaskPopupProps) {
  const { updateTask } = useProjects();

  // local editable state
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  // reset form when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
  }, [task]);

  const handleSave = () => {
    updateTask(projectId, listId, task.id, {
      title,
      description,
      status,
      priority,
      assignedUser: task.assignedUser,
      dueDate: task.dueDate,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit Task</DialogTitle>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="block">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="block">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex space-x-4 justify-between">
            <div className="flex-1 space-y-1">
              <Label htmlFor="status" className="block">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(v: TaskStatus) => setStatus(v)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="priority" className="block">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v: TaskPriority) => setPriority(v)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
