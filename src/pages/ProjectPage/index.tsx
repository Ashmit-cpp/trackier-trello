// src/pages/ProjectPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TaskStatus, TaskPriority, Task } from "@/lib/types";

const listSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().optional(),
});
type ListForm = z.infer<typeof listSchema>;

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["Low", "Medium", "High"]),
});
type TaskForm = z.infer<typeof taskSchema>;

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, createList, createTask, moveTask } = useProjects();
  const project = projects.find((p) => p.id === projectId)!;

  // RHF for New List
  const listForm = useForm<ListForm>({
    resolver: zodResolver(listSchema),
    defaultValues: { title: "", imageUrl: "" },
  });

  // RHF for New Task
  const taskForm = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "Medium",
    },
  });
  const [taskForListId, setTaskForListId] = useState<string | null>(null);

  // Task popup
  const [popupTaskId, setPopupTaskId] = useState<string | null>(null);
  let popupTask: Task | null = null;
  let popupListId: string | null = null;
  for (const list of project.lists) {
    const found = list.tasks.find((t) => t.id === popupTaskId);
    if (found) {
      popupTask = found;
      popupListId = list.id;
      break;
    }
  }

  // Drag & drop
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

  // Handlers wired to RHF
  const onSubmitList = (data: ListForm) => {
    createList(project.id, data.title, data.imageUrl || undefined);
    listForm.reset();
    setListDialogOpen(false);
  };

  const onSubmitTask = (data: TaskForm) => {
    if (!taskForListId) return;
    createTask(
      project.id,
      taskForListId,
      data.title,
      data.description || "",
      data.status,
      data.priority
    );
    taskForm.reset();
    setTaskForListId(null);
    setTaskDialogOpen(false);
  };

  // Dialog visibility
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <Button onClick={() => setListDialogOpen(true)}>Add New List</Button>
      </div>

      {/* Drag-and-drop Lists */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 gap-6">
          {project.lists.map((list) => {
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
                        {list.imageUrl && (
                          <img
                            src={list.imageUrl}
                            alt={list.title}
                            className="mb-2 w-full h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex-1">
                            <h2 className="text-lg font-semibold">
                              {list.title}
                            </h2>
                            <Progress value={progress} className="mt-1" />
                          </div>
                        </div>
                        <div className="space-y-2 flex flex-col ">
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
                                    <div className="flex justify-between">
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
                            size="sm"
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
        <DialogContent className="space-y-4">
          <DialogTitle>Create New List</DialogTitle>

          <form onSubmit={listForm.handleSubmit(onSubmitList)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="list-title">Title</Label>
                <Input id="list-title" {...listForm.register("title")} />
                {listForm.formState.errors.title && (
                  <p className="text-red-500 text-sm">
                    {listForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="list-image">Image URL (optional)</Label>
                <Input id="list-image" {...listForm.register("imageUrl")} />
                {listForm.formState.errors.imageUrl && (
                  <p className="text-red-500 text-sm">
                    {listForm.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={taskDialogOpen}
        onOpenChange={() => setTaskDialogOpen(false)}
      >
        <DialogContent className="space-y-4">
          <DialogTitle>Create New Task</DialogTitle>

          <form onSubmit={taskForm.handleSubmit(onSubmitTask)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input id="task-title" {...taskForm.register("title")} />
                {taskForm.formState.errors.title && (
                  <p className="text-red-500 text-sm">
                    {taskForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-desc">Description</Label>
                <Input id="task-desc" {...taskForm.register("description")} />
              </div>
              <div className="flex justify-between items-center space-x-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="task-status">Status</Label>
                  <Select
                    // id="task-status"
                    {...taskForm.register("status")}
                    onValueChange={(v: TaskStatus) =>
                      taskForm.setValue("status", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    // id="task-priority"
                    {...taskForm.register("priority")}
                    onValueChange={(v: TaskPriority) =>
                      taskForm.setValue("priority", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
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
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
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
