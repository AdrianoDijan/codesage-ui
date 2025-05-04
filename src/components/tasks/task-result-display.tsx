import { TaskResultSchema } from "@/api/models";
import { TaskResult } from "../results";
import { useTaskStream } from "@/hooks/useTaskStream";
import { useEffect, useState } from "react";
import { parseMessageContent } from "@/lib/utils/formatting";
import { Loader2 } from "lucide-react";

interface TaskResultDisplayProps {
  result?: TaskResultSchema;
  taskId?: string;
  projectId?: string;
  showLiveUpdates?: boolean;
}

export function TaskResultDisplay({
  result: initialResult,
  taskId,
  projectId,
  showLiveUpdates = false,
}: TaskResultDisplayProps) {
  const [result, setResult] = useState<TaskResultSchema | undefined>(
    initialResult,
  );
  const {
    lastMessage,
    state: taskState,
    connected: isConnected,
  } = useTaskStream(projectId ?? "", taskId ?? "");

  // Update result if initial result changes
  useEffect(() => {
    if (initialResult) {
      setResult(initialResult);
    }
  }, [initialResult]);

  // Process incoming messages for results
  useEffect(() => {
    if (lastMessage && lastMessage.message_type === "tool") {
      const possibleResult = parseMessageContent(lastMessage.content);
      if (possibleResult) {
        setResult(possibleResult);
      }
    }
  }, [lastMessage]);

  // Handle loading state when no result is available yet
  if (!result) {
    return (
      <div className="rounded-lg p-4 bg-background">
        <div className="flex items-center justify-center space-x-2 h-40">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isConnected && taskState === "running"
              ? "Waiting for results..."
              : !isConnected
                ? "Connecting to live updates..."
                : "No results available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 bg-background">
      <TaskResult content={result} />

      {showLiveUpdates && taskState === "running" && (
        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          {isConnected ? "Connected - receiving live updates" : "Connecting..."}
        </div>
      )}
    </div>
  );
}
