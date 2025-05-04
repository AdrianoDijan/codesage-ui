import { useState } from "react";
import { useGetTask } from "@/api/endpoints/tasks/tasks.gen";
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
  PlayCircle,
  CheckCircle,
  ClockIcon,
  AlertCircle,
  MessageCircle,
  FileCode,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskState, TaskType, ProjectTaskOutput } from "@/api/models";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TaskResultRenderer } from "./task-result-renderer";

// Task status mapping for consistent display across components
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

// Types for props
interface TaskDetailsProps {
  projectId: string;
  taskId: string;
  task?: ProjectTaskOutput; // Optional task data if already available
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

export function TaskDetails({ projectId, taskId, task: initialTask, className = "" }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState("messages");
  
  // If we don't have the task data passed in, we need to fetch it
  const {
    data: taskData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTask(projectId, taskId, {
    query: {
      // If we already have the task data, use it as initialData
      ...(initialTask ? { initialData: { data: { task: initialTask } } } : {}),
      refetchInterval: (data) => {
        // Auto-refresh for active tasks
        const taskState = data?.data?.task?.state;
        if (
          taskState === TaskState.running ||
          taskState === TaskState.waiting ||
          taskState === TaskState.pending
        ) {
          return 5000; // Refresh every 5 seconds for active tasks
        }
        return false; // Don't refresh for completed tasks
      },
    },
  });

  if (isLoading && !initialTask) {
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
            Failed to load task: {error?.message || "Unknown error"}
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

  const task = taskData?.data?.task || initialTask;
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

  // Get task status for display
  const taskStatus = taskStatusMap[task.state];

  return (
    <Card className={`border shadow-sm ${className}`}>
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
          </div>
          <CardDescription>
            Task ID: {task.id} • Created: {formatDate(task.created_at)}
          </CardDescription>
        </div>
        {(task.state === TaskState.running || 
          task.state === TaskState.waiting || 
          task.state === TaskState.pending) && (
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
                {task.messages.map((message, index) => {
                  // Try to parse message content if it's a JSON string
                  let parsedContent;
                  let isSpecialResultType = false;
                  
                  if (typeof message.content === "string") {
                    try {
                      // Attempt to parse the string as JSON
                      parsedContent = JSON.parse(message.content);
                      
                      // Check if it has the special result type structure
                      if (parsedContent && 
                          typeof parsedContent === 'object' &&
                          'type' in parsedContent && 
                          'result' in parsedContent) {
                        isSpecialResultType = true;
                      }
                    } catch (e) {
                      // If parsing fails, it's not JSON, just regular text
                      parsedContent = null;
                    }
                  } else {
                    // For non-string content (shouldn't normally happen)
                    parsedContent = message.content;
                  }

                  return (
                    <div 
                      key={`${message.id || index}`}
                      className="rounded-lg border p-4 bg-background/80 hover:bg-background transition-colors"
                    >
                      <p className="text-sm font-medium text-primary mb-2">
                        {message.name}
                      </p>
                      <div className="prose prose-sm dark:prose-invert prose-headings:font-medium prose-p:text-foreground/90 prose-code:text-secondary-foreground prose-code:bg-secondary/30 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-secondary/20 prose-pre:text-foreground/90 prose-pre:rounded-md max-w-none">
                        {isSpecialResultType ? (
                          <TaskResultRenderer content={parsedContent} />
                        ) : typeof message.content === "string" ? (
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              pre: ({ node, ...props }) => (
                                <pre className="bg-secondary/20 p-3 rounded-lg overflow-auto my-4 text-sm" {...props} />
                              ),
                              code: ({ node, inline, ...props }) => (
                                inline ? 
                                <code className="bg-secondary/30 px-1.5 py-0.5 rounded text-xs font-mono" {...props} /> : 
                                <code className="font-mono text-xs" {...props} />
                              ),
                              h1: (props) => <h1 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                              h2: (props) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                              h3: (props) => <h3 className="text-base font-medium mt-3 mb-2" {...props} />,
                              ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                              ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                              li: (props) => <li className="my-0.5" {...props} />,
                              p: (props) => <p className="my-2" {...props} />,
                              a: (props) => <a className="text-primary underline hover:text-primary/80" {...props} />,
                              blockquote: (props) => <blockquote className="border-l-4 border-muted pl-4 italic my-2" {...props} />
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <pre className="text-xs overflow-auto p-3 rounded-lg bg-secondary/20 font-mono">
                            {JSON.stringify(message.content, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No messages available for this task.
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="result">
            {task.result ? (
              <div className="rounded-lg border p-4 bg-background">
                {task.result.type && task.result.result ? (
                  <TaskResultRenderer content={task.result} />
                ) : (
                  <>
                    <p className="text-sm font-medium mb-2">
                      Result Type: {task.result.type}
                    </p>
                    <pre className="text-xs overflow-auto p-2 rounded bg-secondary/20 max-h-80">
                      {JSON.stringify(task.result.result, null, 2)}
                    </pre>
                  </>
                )}
              </div>
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