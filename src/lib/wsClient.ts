import ReconnectingWebSocket from "reconnecting-websocket";
import mitt from "mitt";
import { getAccessToken } from "@/lib/auth/auth-service";
import {
  TaskStateUpdatedEvent,
  TaskMessageCreatedEvent,
  ChatStateUpdatedEvent,
  ChatMessageCreatedEvent,
  WebSocketEvent,
} from "@/api/models/websocket";

// Event map for the emitter - using specific event types where possible
interface WSEventMap {
  open: undefined;
  close: CloseEvent;
  error: Event;
  // domain events -----------------------------
  task_state_updated: TaskStateUpdatedEvent;
  task_message_created: TaskMessageCreatedEvent;
  chat_state_updated: ChatStateUpdatedEvent;
  chat_message_created: ChatMessageCreatedEvent;
}

export class WSClient {
  private socket?: ReconnectingWebSocket;
  private emitter = mitt<WSEventMap>();
  private readonly url: string;
  private readonly protocols: string[];

  constructor(
    projectId: string,
    taskId?: string,
    chatId?: string,
    lastMessageId?: string,
  ) {
    const baseUrl =
      (import.meta.env.VITE_BASE_API_URL as string | undefined) ??
      "http://localhost:8080";
    if (taskId) {
      this.url =
        baseUrl.replace(/^http/, "ws") +
        `/api/projects/${projectId}/tasks/${taskId}`;
    } else if (chatId) {
      let path = `/api/projects/${projectId}/chats/${chatId}`;
      if (lastMessageId) {
        path += `?last_message_id=${lastMessageId}`;
      }
      this.url = baseUrl.replace(/^http/, "ws") + path;
    } else {
      // default generic project stream (if implemented later)
      this.url =
        baseUrl.replace(/^http/, "ws") + `/api/projects/${projectId}/stream`;
    }

    const token = getAccessToken();
    this.protocols = token
      ? [
          "codesage.json",
          `base64url.bearer.authorization.codesage.${btoa(token).replace(/=+$/, "")}`,
        ]
      : ["codesage.json"];
  }

  connect() {
    if (this.socket) return; // already connected/connecting
    this.socket = new ReconnectingWebSocket(this.url, this.protocols, {
      maxRetries: 10,
      maxReconnectionDelay: 30_000,
    });

    this.socket.addEventListener("open", () => {
      this.emitter.emit("open", undefined);
    });
    this.socket.addEventListener("close", (evt) => {
      this.emitter.emit("close", evt as CloseEvent);
    });
    this.socket.addEventListener("error", (evt) => {
      this.emitter.emit("error", evt as Event);
    });

    this.socket.addEventListener("message", (evt) => {
      try {
        const rawData = JSON.parse(evt.data as string) as unknown;

        // Type guard to ensure the data has the expected shape
        if (rawData && typeof rawData === "object" && "event_type" in rawData) {
          const data = rawData as { event_type: string } & WebSocketEvent;

          // Use a type assertion since we know the event types match our map
          this.emitter.emit(
            data.event_type as keyof WSEventMap,
            data as WSEventMap[keyof WSEventMap],
          );
        }
      } catch (err) {
        console.error("Failed to parse WS message", err, evt.data);
      }
    });
  }

  disconnect() {
    this.socket?.close(1000, "app unmount");
    this.socket = undefined;
  }

  // ------------------- API exposed to React side --------------------
  on<E extends keyof WSEventMap>(
    type: E,
    handler: (event: WSEventMap[E]) => void,
  ) {
    this.emitter.on(type, handler);
  }
  off<E extends keyof WSEventMap>(
    type: E,
    handler: (event: WSEventMap[E]) => void,
  ) {
    this.emitter.off(type, handler);
  }

  send(event: WebSocketEvent) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ event, timestamp: new Date().toISOString() }),
      );
    }
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
