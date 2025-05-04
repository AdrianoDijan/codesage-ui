import { useState, useCallback } from "react";
import { useTaskStream } from "@/hooks/useTaskStream";
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
import { Plus, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { ProjectTaskSchema, TaskState, TaskType } from "@/api/models";
import { useCreateTask } from "@/api/endpoints/tasks/tasks.gen";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { toast } from "sonner";
import { taskStatusMap } from "@/lib/constants/task-status";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatting";

interface ProjectTasksProps {
  projectId: string;
  tasks: ProjectTaskSchema[];
  onRefresh?: () => void;
}

// Component for a single task row that uses the aggregated task state map
function TaskRow({
  task,
  projectId,
  onClick,
}: {
  task: ProjectTaskSchema;
  projectId: string;
  onClick: () => void;
}) {
  const { state: liveState, connected: isWsConnected } = useTaskStream(
    projectId,
    task.id,
  );
  const currentState = liveState ?? task.state;
  const taskStatus = taskStatusMap[currentState];

  return (
    <TableRow
      onClick={onClick}
      className="cursor-pointer hover:bg-secondary/20"
    >
      <TableCell className="font-medium">{task.id}</TableCell>
      <TableCell>
        {task.type == "initial_scan" ? "Initial scan" : task.type}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge
            variant={taskStatus.variant}
            className="flex items-center gap-1 w-fit"
          >
            {taskStatus.icon}
            {taskStatus.label}
          </Badge>

          {/* Show WebSocket connection status for active tasks */}
          {(currentState === TaskState.running ||
            currentState === TaskState.waiting ||
            currentState === TaskState.pending) && (
            <span className="inline-flex">
              {isWsConnected ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-muted-foreground" />
              )}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(task.created_at)}
      </TableCell>
    </TableRow>
  );
}

// Wrapper component is no longer needed; we forward the live state down.
function ConnectedTaskRow({
  task,
  projectId,
  onClick,
}: {
  task: ProjectTaskSchema;
  projectId: string;
  onClick: () => void;
}) {
  return <TaskRow task={task} projectId={projectId} onClick={onClick} />;
}

export function ProjectTasks({
  projectId,
  tasks,
  onRefresh,
}: ProjectTasksProps) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTaskSchema | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const createTask = useCreateTask({
    mutation: {
      onSuccess: () => {
        toast.success("Task created successfully");
        setIsCreatingTask(false);
        if (onRefresh) onRefresh();
      },
      onError: (error) => {
        toast.error("Failed to create task: " + error.message);
        setIsCreatingTask(false);
      },
    },
  });

  const handleCreateAnalysisTask = useCallback(() => {
    setIsCreatingTask(true);
    createTask.mutate({
      projectId,
      data: { task: { type: TaskType.initial_scan } },
    });
  }, [createTask, projectId]);

  const handleTaskRowClick = useCallback((task: ProjectTaskSchema) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      setRefreshing(true);
      onRefresh();
      // Reset refreshing state after a short delay
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  }, [onRefresh]);

  // Determine if there are any active tasks that might change state
  const hasActiveTasks = tasks.some(
    (task) =>
      task.state === TaskState.running ||
      task.state === TaskState.waiting ||
      task.state === TaskState.pending,
  );

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Tasks</CardTitle>
            <CardDescription>View and manage project tasks</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveTasks && onRefresh && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-8 w-8"
                title="Refresh tasks"
              >
                <RefreshCw
                  className={cn("h-4 w-4", refreshing && "animate-spin")}
                />
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleCreateAnalysisTask}
              disabled={isCreatingTask || createTask.isPending}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
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
                {tasks.map((task) => (
                  <ConnectedTaskRow
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    onClick={() => {
                      handleTaskRowClick(task);
                    }}
                  />
                ))}
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
