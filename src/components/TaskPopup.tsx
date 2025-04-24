import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";

interface TaskPopupProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}
export function TaskPopup({ task, open, onClose }: TaskPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{task.title}</DialogTitle>
        <p>{task.description}</p>
        {task.assignedUser && <p>Assigned to: {task.assignedUser}</p>}
        {task.dueDate && <p>Due: {task.dueDate}</p>}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
