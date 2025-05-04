import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  FileCode,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskState, TaskType, ProjectTaskSchema } from "@/api/models";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/formatting";
import { cn } from "@/lib/utils";
import { useTaskDetails } from "@/hooks/useTaskDetails";
import { TaskMessage } from "./task-message";
import { TaskResultDisplay } from "./task-result-display";
import { taskStatusMap } from "@/lib/constants/task-status";
import { useTaskStream } from "@/hooks/useTaskStream";

// Types for props
interface TaskDetailsProps {
  projectId: string;
  taskId: string;
  task?: ProjectTaskSchema; // Optional task data if already available
  className?: string;
}

// Loading skeleton component
export function TaskDetailsSkeleton() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

// Actual task details content, separated to be wrapped with WebSocket provider
function TaskDetailsContent({
  projectId,
  taskId,
  className = "",
}: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState("messages");
  const { connected: isConnected, state: wsTaskState } = useTaskStream(
    projectId,
    taskId,
  );

  // Use our custom hook for fetching task data
  const {
    data: taskData,
    isLoading,
    isError,
    error,
    refetch,
    webSocketEnabled,
  } = useTaskDetails(projectId, taskId);

  if (isLoading) {
    return <TaskDetailsSkeleton />;
  }

  if (isError) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Error Loading Task</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Failed to load task: {error.message || "Unknown error"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const task = taskData?.data.task;
  if (!task) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Task Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested task could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  // Get task status for display - use WebSocket state if available
  const currentState = wsTaskState ?? task.state;
  const taskStatus = taskStatusMap[currentState];
  const isActiveTask =
    currentState === TaskState.running ||
    currentState === TaskState.waiting ||
    currentState === TaskState.pending;

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>
              {task.type === TaskType.initial_scan ? "Initial Scan" : task.type}
            </CardTitle>
            <Badge
              variant={taskStatus.variant}
              className="flex items-center gap-1 w-fit"
            >
              {taskStatus.icon}
              {taskStatus.label}
            </Badge>

            {webSocketEnabled && (
              <span className="inline-flex items-center ml-2 text-xs text-muted-foreground">
                {isConnected ? (
                  <Wifi className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <WifiOff className="h-3 w-3 text-muted-foreground mr-1" />
                )}
                {isConnected ? "Live" : "Offline"}
              </span>
            )}
          </div>
          <CardDescription>
            Task ID: {task.id} • Created: {formatDate(task.created_at)}
          </CardDescription>
        </div>

        {isActiveTask && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="messages" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="result" className="flex items-center gap-1">
              <FileCode className="h-4 w-4" />
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            {task.messages && task.messages.length > 0 ? (
              <div className="space-y-4">
                {task.messages.map((message) => (
                  <TaskMessage key={message.id} message={message} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No messages available for this task.
              </p>
            )}
          </TabsContent>

          <TabsContent value="result">
            {task.result ? (
              <TaskResultDisplay
                result={task.result}
                taskId={taskId}
                projectId={projectId}
                showLiveUpdates={isActiveTask}
              />
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No result available for this task yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Main component now just renders the content; the project-level
// WebSocketProvider supplies the stream context.
export function TaskDetails(props: TaskDetailsProps) {
  return <TaskDetailsContent {...props} />;
}
