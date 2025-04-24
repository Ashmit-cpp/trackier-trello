// src/pages/ProjectPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TaskPopup } from "@/components/TaskPopup";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TaskStatus, TaskPriority, Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, createList, createTask, moveTask } = useProjects();
  const project = projects.find((p) => p.id === projectId)!;

  // New List dialog state
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  // New Task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForListId, setTaskForListId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  const [newTaskPriority, setNewTaskPriority] =
    useState<TaskPriority>("Medium");

  // Task detail popup
  const [popupTaskId, setPopupTaskId] = useState<string | null>(null);
  let popupTask: Task | null = null;
  let popupListId: string | null = null;

  // find the task and its list
  for (const list of project.lists) {
    const found = list.tasks.find((t) => t.id === popupTaskId);
    if (found) {
      popupTask = found;
      popupListId = list.id;
      break;
    }
  }
  // Drag & drop handler
  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    moveTask(
      project.id,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  }

  // Create List
  function handleCreateList() {
    if (!newListTitle.trim()) return;
    createList(project.id, newListTitle.trim());
    setNewListTitle("");
    setListDialogOpen(false);
  }

  // Create Task
  function handleCreateTask() {
    if (!taskForListId || !newTaskTitle.trim()) return;
    createTask(
      project.id,
      taskForListId,
      newTaskTitle.trim(),
      newTaskDesc.trim(),
      newTaskStatus,
      newTaskPriority
    );
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskStatus("todo");
    setNewTaskPriority("Medium");
    setTaskForListId(null);
    setTaskDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header & New List */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <Button onClick={() => setListDialogOpen(true)}>+ New List</Button>
      </div>

      {/* Lists with drag-and-drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 gap-6">
          {project.lists.map((list) => {
            // compute progress
            const total = list.tasks.length;
            const doneCount = list.tasks.filter(
              (t) => t.status === "done"
            ).length;
            const progress = total ? Math.round((doneCount / total) * 100) : 0;

            return (
              <Droppable droppableId={list.id} key={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4"
                  >
                    <Card>
                      <CardContent>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex-1">
                            <h2 className="text-lg font-semibold">
                              {list.title}
                            </h2>
                            <Progress value={progress} className="mt-1" />
                          </div>
                        </div>
                        <div className="space-y-2 w-full flex flex-col justify-center items-center">
                          {list.tasks.map((task, idx) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={idx}
                            >
                              {(prov) => (
                                <Card
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  onClick={() => setPopupTaskId(task.id)}
                                  className="cursor-pointer"
                                >
                                  <CardContent>
                                    <div className="flex justify-between gap-3 items-center">
                                      <h3 className="font-medium">
                                        {task.title}
                                      </h3>
                                      <Badge className="text-xs uppercase">
                                        {task.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {task.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 capitalize">
                                      Status: {task.status}
                                    </p>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))}

                          <Button
                            variant={"outline"}
                            onClick={() => {
                              setTaskForListId(list.id);
                              setTaskDialogOpen(true);
                            }}
                          >
                            Add Task
                          </Button>
                          {provided.placeholder}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* New List Dialog */}
      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogContent>
          {" "}
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
          </DialogFooter>{" "}
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog
        open={taskDialogOpen}
        onOpenChange={() => setTaskDialogOpen(false)}
      >
        <DialogContent className="space-y-4">
          <DialogTitle>Create New Task</DialogTitle>

          <div className="space-y-1">
            <Label htmlFor="new-task-title" className="block">
              Title
            </Label>
            <Input
              id="new-task-title"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="new-task-desc" className="block">
              Description
            </Label>
            <Input
              id="new-task-desc"
              placeholder="Task description"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
          </div>

          <div className="flex space-x-4 justify-between">
            <div className="space-y-1">
              <Label htmlFor="new-task-status" className="block">
                Status
              </Label>
              <Select
                value={newTaskStatus}
                onValueChange={(v: TaskStatus) => setNewTaskStatus(v)}
              >
                <SelectTrigger id="new-task-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="new-task-priority" className="block">
                Priority
              </Label>
              <Select
                value={newTaskPriority}
                onValueChange={(v: TaskPriority) => setNewTaskPriority(v)}
              >
                <SelectTrigger id="new-task-priority">
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

          <DialogFooter>
            <Button
              onClick={handleCreateTask}
              disabled={
                !newTaskTitle.trim() ||
                !taskForListId ||
                !newTaskStatus ||
                !newTaskPriority
              }
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Popup */}
      {popupTask && popupListId && (
        <TaskPopup
          projectId={project.id}
          listId={popupListId}
          task={popupTask}
          open={!!popupTaskId}
          onClose={() => setPopupTaskId(null)}
        />
      )}
    </div>
  );
}
