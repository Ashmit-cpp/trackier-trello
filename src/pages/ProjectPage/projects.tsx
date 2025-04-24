// src/pages/ProjectPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TaskPopup } from "@/components/TaskPopup";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, createList, createTask } = useProjects();
  const project = projects.find((p) => p.id === projectId)!;

  // -- New List dialog state --
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  // -- New Task dialog state --
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForListId, setTaskForListId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [popupTaskId, setPopupTaskId] = useState<string | null>(null);

  // Create handlers
  const handleCreateList = () => {
    createList(project.id, newListTitle.trim());
    setNewListTitle("");
    setListDialogOpen(false);
  };

  const handleCreateTask = () => {
    if (!taskForListId) return;
    createTask(
      project.id,
      taskForListId,
      newTaskTitle.trim(),
      newTaskDesc.trim()
    );
    setNewTaskTitle("");
    setNewTaskDesc("");
    setTaskForListId(null);
    setTaskDialogOpen(false);
  };

  // find the task object for the popup
  const popupTask =
    project.lists.flatMap((l) => l.tasks).find((t) => t.id === popupTaskId) ||
    null;

  return (
    <div>
      {/* Project Header */}
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <p className="mb-4">{project.description}</p>
      <Button onClick={() => setListDialogOpen(true)} className="mb-6">
        + New List
      </Button>

      {/* Lists and Tasks */}
      <div className="grid grid-cols-2 gap-6">
        {project.lists.map((list) => (
          <div key={list.id} className="space-y-4">
            {/* List Card */}
            <Card>
              <CardContent>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{list.title}</h2>
                  <Button
                    size="sm"
                    onClick={() => {
                      setTaskForListId(list.id);
                      setTaskDialogOpen(true);
                    }}
                  >
                    + Task
                  </Button>
                </div>
                {/* Tasks */}
                <div className="mt-3 space-y-2">
                  {list.tasks.map((task) => (
                    <Card
                      key={task.id}
                      onClick={() => setPopupTaskId(task.id)}
                      className="cursor-pointer"
                    >
                      <CardContent>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* New List Dialog */}
      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogContent>
          <DialogTitle>Create New List</DialogTitle>
          <Input
            placeholder="List title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleCreateList} disabled={!newListTitle.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog
        open={taskDialogOpen}
        onOpenChange={() => setTaskDialogOpen(false)}
      >
        <DialogContent className="space-y-2">
          <DialogTitle>Create New Task</DialogTitle>

          <Input
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Input
            placeholder="Task description"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={handleCreateTask}
              disabled={!newTaskTitle.trim() || !taskForListId}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Popup */}
      {popupTask && (
        <TaskPopup
          open={!!popupTaskId}
          task={popupTask}
          onClose={() => setPopupTaskId(null)}
        />
      )}
    </div>
  );
}
