import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useProjectPageLogic } from "@/hooks/useProjectPageLogic";
import { CreateListDialog } from "./components/CreateListDialog";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { ListGrid } from "./components/ListGrid";
import { TaskPopup } from "./components/TaskPopup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  MoreHorizontal,
  FolderKanban,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

  // Calculate project statistics
  const totalTasks = project.lists.reduce((acc, list) => acc + list.tasks.length, 0);
  const completedTasks = project.lists.reduce(
    (acc, list) => acc + list.tasks.filter(task => task.status === "done").length, 
    0
  );
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b shadow-sm">
        <div className="px-6">
          {/* Project Header */}
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold text-secondary truncate">
                      {project.title}
                    </h1>
                    <p className="text-primary mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">
                      {project.lists.length} {project.lists.length === 1 ? "List" : "Lists"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">
                      {totalTasks} {totalTasks === 1 ? "Task" : "Tasks"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={progressPercentage === 100 ? "default" : "secondary"}
                      className="px-2 py-1"
                    >
                      {progressPercentage}% Complete
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Updated recently</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  onClick={() => setListDialogOpen(true)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add List
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>Project Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Empty State */}
        {project.lists.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderKanban className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to get organized?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first list to start organizing tasks and tracking progress on this project.
            </p>
            <Button
              onClick={() => setListDialogOpen(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First List
            </Button>
          </div>
        ) : (
          /* Lists Grid */
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
        )}
      </div>

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
