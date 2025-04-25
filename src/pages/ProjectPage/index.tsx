import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useProjectPageLogic } from "@/hooks/useProjectPageLogic";
import { CreateListDialog } from "./components/CreateListDialog";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { ListGrid } from "./components/ListGrid";
import { TaskPopup } from "./components/TaskPopup";
import { Button } from "@/components/ui/button";
declare global {
  interface Window {
    exposeForTesting?: {
      onDragEnd?: (...args: any[]) => void;
    };
  }
}

export default function ProjectPage() {
  const {
    project,
    listForm,
    taskForm,
    listDialogOpen,
    setListDialogOpen,
    taskDialogOpen,
    setTaskDialogOpen,
    setTaskForListId,
    popupData,
    onSubmitList,
    onSubmitTask,
    onDragEnd,
    deleteList,
    popupTaskId,
    setPopupTaskId,
  } = useProjectPageLogic();

  useEffect(() => {
    if (window.exposeForTesting) {
      window.exposeForTesting.onDragEnd = onDragEnd;
    }
  }, [onDragEnd]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <Button onClick={() => setListDialogOpen(true)}>Add New List</Button>
      </div>

      {/* Drag‐and‐Drop Lists */}
      <DragDropContext onDragEnd={onDragEnd}>
        <ListGrid
          lists={project.lists}
          deleteList={deleteList}
          setTaskDialogOpen={setTaskDialogOpen}
          setTaskForListId={setTaskForListId}
          setPopupTaskId={setPopupTaskId}
          projectId={project.id}
        />
      </DragDropContext>

      {/* Dialogs */}
      <CreateListDialog
        open={listDialogOpen}
        onClose={() => setListDialogOpen(false)}
        form={listForm}
        onSubmit={onSubmitList}
      />
      <CreateTaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        form={taskForm}
        onSubmit={onSubmitTask}
      />

      {/* Task Detail Popup */}
      {popupData.task && popupData.listId && (
        <TaskPopup
          projectId={project.id}
          listId={popupData.listId}
          task={popupData.task}
          open={!!popupTaskId}
          onClose={() => setPopupTaskId(null)}
        />
      )}
    </div>
  );
}
