import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TaskCard } from "./TaskCard";
import { List } from "@/lib/types";

export interface ListCardProps {
  projectId: string;
  list: List;
  deleteList: (projectId: string, listId: string) => void;
  setTaskDialogOpen: (open: boolean) => void;
  setTaskForListId: (listId: string) => void;
  setPopupTaskId: (taskId: string | null) => void;
}

export function ListCard({
  projectId,
  list,
  deleteList,
  setTaskDialogOpen,
  setTaskForListId,
  setPopupTaskId,
}: ListCardProps) {
  const total = list.tasks.length;
  const doneCount = list.tasks.filter((t) => t.status === "done").length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <Card>
      <CardContent>
        {list.imageUrl && (
          <img
            src={list.imageUrl}
            alt={list.title}
            className="mb-2 w-full h-24 object-cover rounded"
          />
        )}
        <Progress value={progress} className="mt-1" />

        <div className="flex justify-between items-center my-2">
          <h2 className="text-lg font-semibold text-primary">{list.title}</h2>
        </div>
        <div className="space-y-2">
          {list.tasks.map((task, idx) => (
            <TaskCard
              key={task.id}
              task={task}
              index={idx}
              setPopupTaskId={setPopupTaskId}
            />
          ))}

          <div className="flex w-full justify-between items-center mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Delete List
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteList(projectId, list.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setTaskForListId(list.id);
                setTaskDialogOpen(true);
              }}
            >
              Add Task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
