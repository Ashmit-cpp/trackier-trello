import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TaskCardProps {
  task: any;
  index: number;
  setPopupTaskId: (taskId: string | null) => void;
}

export function TaskCard({ task, index, setPopupTaskId }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(prov) => (
        <Card
          ref={prov.innerRef}
          {...prov.draggableProps}
          {...prov.dragHandleProps}
          onClick={() => setPopupTaskId(task.id)}
          data-draggable-id={task.id} // ← add this
          className="cursor-pointer"
          data-cy="task"
          data-cy-task-id={task.id}
          data-cy-task-title={task.title}
          data-cy-task-index={index}
        >
          <CardContent>
            <div className="flex justify-between">
              <h3 className="font-medium text-secondary">{task.title}</h3>
              <div className="flex gap-2">
                <Badge
                  className={cn(
                    "text-xs rounded",
                    task.status === "todo" && "bg-gray-200 text-gray-800",
                    task.status === "in-progress" &&
                      "bg-blue-200 text-blue-800",
                    task.status === "done" && "bg-green-200 text-green-800"
                  )}
                >
                  {task.status === "todo" && "To Do"}
                  {task.status === "in-progress" && "In Progress"}
                  {task.status === "done" && "Done"}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs rounded",
                    task.priority === "Low" && "bg-green-100 text-green-800",
                    task.priority === "Medium" &&
                      "bg-yellow-100 text-yellow-800",
                    task.priority === "High" && "bg-red-100 text-red-800"
                  )}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-primary">{task.description}</p>
            <div className="flex justify-between mt-2">
              {task.assignedUser && (
                <p className="text-xs">Assigned: {task.assignedUser}</p>
              )}
              {task.dueDate && (
                <p className="text-xs">
                  Due: {format(new Date(task.dueDate), "PPP")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
