import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { DropResult } from "@hello-pangea/dnd";

// Schemas
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
  assignedUser: z.string().optional(),
});
type TaskForm = z.infer<typeof taskSchema>;

export const useProjectPageLogic = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, createList, createTask, moveTask } = useProjects();
  const project = projects.find((p) => p.id === projectId)!;

  const listForm = useForm<ListForm>({
    resolver: zodResolver(listSchema),
    defaultValues: { title: "", imageUrl: "https://placehold.co/600x400" },
    mode: "onChange",
  });

  const taskForm = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "Medium",
      assignedUser: "",
    },
    mode: "onChange",
  });

  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForListId, setTaskForListId] = useState<string | null>(null);
  const [popupTaskId, setPopupTaskId] = useState<string | null>(null);

  const popupData = useMemo(() => {
    for (const list of project.lists) {
      const task = list.tasks.find((t) => t.id === popupTaskId);
      if (task) return { task, listId: list.id };
    }
    return { task: null, listId: null };
  }, [popupTaskId, project.lists]);

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
      data.priority,
      data.assignedUser || undefined
    );
    taskForm.reset();
    setTaskDialogOpen(false);
    setTaskForListId(null);
  };

  const onDragEnd = (result: DropResult) => {
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
  };

  return {
    project,
    listForm,
    taskForm,
    listDialogOpen,
    setListDialogOpen,
    taskDialogOpen,
    setTaskDialogOpen,
    taskForListId,
    setTaskForListId,
    popupTaskId,
    setPopupTaskId,
    popupData,
    onSubmitList,
    onSubmitTask,
    onDragEnd,
  };
};
