import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskDetails } from "@/components/tasks/task-details";
import { ProjectTaskSchema } from "@/api/models";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
  projectId: string;
  taskId: string;
  task?: ProjectTaskSchema;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
}

export function TaskDialog({
  projectId,
  taskId,
  task,
  trigger,
  open,
  onOpenChange,
  title = "Task Details",
}: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "max-h-[90vh] w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl",
          "rounded-xl shadow-lg border-0",
          "bg-background/95 backdrop-blur-sm",
          "overflow-hidden flex flex-col",
        )}
      >
        <DialogHeader className="px-6 py-4">
          <DialogTitle className="text-xl font-medium">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-1">
          <TaskDetails
            projectId={projectId}
            taskId={taskId}
            task={task}
            className="border-0 shadow-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
