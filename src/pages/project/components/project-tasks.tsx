import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  PlayCircle,
  CheckCircle,
  ClockIcon,
  AlertCircle,
} from "lucide-react";
import { ProjectTaskOutput, TaskState, TaskType } from "@/api/models";
import { useCreateTask } from "@/api/endpoints/tasks/tasks.gen";
import { TaskDialog } from "@/components/task-dialog";
import { toast } from "sonner";

interface ProjectTasksProps {
  projectId: string;
  tasks: ProjectTaskOutput[];
}

const taskStatusMap: Record<
  TaskState,
  {
    label: string;
    icon: React.JSX.Element;
    variant: "secondary" | "default" | "destructive" | "outline";
  }
> = {
  [TaskState.pending]: {
    label: "Pending",
    icon: <ClockIcon className="h-3 w-3" />,
    variant: "secondary",
  },
  [TaskState.running]: {
    label: "Running",
    icon: <PlayCircle className="h-3 w-3" />,
    variant: "default",
  },
  [TaskState.completed]: {
    label: "Completed",
    icon: <CheckCircle className="h-3 w-3" />,
    variant: "secondary",
  },
  [TaskState.failed]: {
    label: "Failed",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "destructive",
  },
  [TaskState.interrupted]: {
    label: "Interrupted",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "outline",
  },
  [TaskState.timeout]: {
    label: "Timeout",
    icon: <ClockIcon className="h-3 w-3" />,
    variant: "destructive",
  },
  [TaskState.cancelled]: {
    label: "Cancelled",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "secondary",
  },
  [TaskState.waiting]: {
    label: "Waiting",
    icon: <ClockIcon className="h-3 w-3" />,
    variant: "outline",
  },
};

export function ProjectTasks({ projectId, tasks }: ProjectTasksProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTaskOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createTask = useCreateTask({
    mutation: {
      onSuccess: () => {
        toast.success("Task created successfully");
        setIsCreatingTask(false);
      },
      onError: (error) => {
        toast.error("Failed to create task: " + error.message);
        setIsCreatingTask(false);
      },
    },
  });

  const handleCreateAnalysisTask = () => {
    setIsCreatingTask(true);
    createTask.mutate({
      projectId,
      data: { type: TaskType.initial_scan },
    });
  };

  const handleTaskRowClick = (task: ProjectTaskOutput) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Tasks</CardTitle>
            <CardDescription>View and manage project tasks</CardDescription>
          </div>
          <Button
            size="sm"
            onClick={handleCreateAnalysisTask}
            disabled={isCreatingTask || createTask.isPending}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const taskStatus = taskStatusMap[task.state];

                  return (
                    <TableRow 
                      key={task.id} 
                      onClick={() => handleTaskRowClick(task)}
                      className="cursor-pointer hover:bg-secondary/20"
                    >
                      <TableCell className="font-medium">
                        {task.id}
                      </TableCell>
                      <TableCell>
                        {task.type == "initial_scan" ? "Initial scan" : task.type}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={taskStatus.variant}
                          className="flex items-center gap-1 w-fit"
                        >
                          {taskStatus.icon}
                          {taskStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(task.created_at)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No tasks have been created for this project yet.
              </p>
              <Button
                onClick={handleCreateAnalysisTask}
                disabled={isCreatingTask || createTask.isPending}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Create First Analysis Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Dialog */}
      {selectedTask && (
        <TaskDialog
          projectId={projectId}
          taskId={selectedTask.id}
          task={selectedTask}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
