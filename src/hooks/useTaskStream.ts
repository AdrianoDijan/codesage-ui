import { useEffect, useState, useRef } from "react";
import {
  TaskStateUpdatedEvent,
  TaskMessageCreatedEvent,
  CreateTaskMessageEvent,
} from "@/api/models/websocket";
import { TaskState, MessageType } from "@/api/models";
import { WSClient } from "@/lib/wsClient";

export function useTaskStream(projectId: string, taskId: string) {
  const client = useRef<WSClient | null>(null);
  const [state, setState] = useState<TaskState | undefined>(undefined);
  const [lastMessage, setLastMessage] = useState<
    TaskMessageCreatedEvent["message"] | undefined
  >(undefined);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const handleState = (e: TaskStateUpdatedEvent) => {
      if (e.task_id === taskId) setState(e.new_state);
    };
    const handleMsg = (e: TaskMessageCreatedEvent) => {
      if (e.task_id === taskId) setLastMessage(e.message);
    };
    const handleOpen = () => {
      setConnected(true);
    };
    const handleClose = () => {
      setConnected(false);
    };

    client.current = new WSClient(projectId, taskId);
    client.current.connect();
    client.current.on("task_state_updated", handleState);
    client.current.on("task_message_created", handleMsg);
    client.current.on("open", handleOpen);
    client.current.on("close", handleClose);

    return () => {
      client.current?.off("task_state_updated", handleState);
      client.current?.off("task_message_created", handleMsg);
      client.current?.off("open", handleOpen);
      client.current?.off("close", handleClose);
      client.current?.disconnect();
    };
  }, [projectId, taskId]);

  const sendTaskMessage = (
    content: string,
    messageType: MessageType = MessageType.human,
  ) => {
    const event: CreateTaskMessageEvent = {
      event_type: "create_task_message",
      task_id: taskId,
      content,
      message_type: messageType,
    };
    client.current?.send(event);
  };

  return {
    state,
    lastMessage,
    connected,
    sendTaskMessage,
  };
}
