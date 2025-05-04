import { useGetTask } from "@/api/endpoints/tasks/tasks.gen";
import { TaskState } from "@/api/models";
import { useTaskStream } from "./useTaskStream";
import { useEffect, useState } from "react";

export const useTaskDetails = (
  projectId: string,
  taskId: string,
  useWebSocketUpdates = true,
) => {
  const [webSocketEnabled, setWebSocketEnabled] = useState(false);

  const { state: wsTaskState, lastMessage } = useTaskStream(projectId, taskId);

  const taskQuery = useGetTask(projectId, taskId, {
    query: {
      refetchInterval: (data) => {
        const taskState = data.state.data?.data.task.state;

        if (webSocketEnabled && wsTaskState) {
          return false;
        }

        if (
          !taskState ||
          taskState === TaskState.running ||
          taskState === TaskState.waiting ||
          taskState === TaskState.pending
        ) {
          return 1000;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (useWebSocketUpdates && taskQuery.data && !webSocketEnabled) {
      setWebSocketEnabled(true);
    }
  }, [taskQuery.data, useWebSocketUpdates, webSocketEnabled]);

  useEffect(() => {
    if (webSocketEnabled && wsTaskState && taskQuery.data) {
      const currentState = taskQuery.data.data.task.state;
      if (wsTaskState !== currentState) {
        void taskQuery.refetch();
      }
    }
  }, [wsTaskState, taskQuery, webSocketEnabled]);

  useEffect(() => {
    if (
      webSocketEnabled &&
      lastMessage &&
      lastMessage.message_type === "tool"
    ) {
      void taskQuery.refetch();
    }
  }, [lastMessage, taskQuery, webSocketEnabled]);

  return {
    ...taskQuery,
    webSocketEnabled,
    wsTaskState,
  };
};
