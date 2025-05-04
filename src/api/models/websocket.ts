import { TaskState } from "./taskState";
import { MessageType } from "./messageType";

/**
 * WebSocket event types
 */
export type WebSocketEventType =
  | "chat_state_updated"
  | "create_chat_message"
  | "create_task_message"
  | "task_message_created"
  | "chat_message_created"
  | "task_state_updated";

/**
 * Chat state enum
 */
export type ChatState =
  | "archived"
  | "pending"
  | "waiting"
  | "processing"
  | "failed";

/**
 * Base interface for all WebSocket events
 */
export interface BaseWebSocketEvent<T = unknown> {
  event: T;
  timestamp?: string;
}

/**
 * Attachment upload format
 */
export interface AttachmentUpload {
  file_name: string;
  file_type: string;
  file_content: string; // DataURI format
}

/**
 * Event emitted when a chat state changes
 */
export interface ChatStateUpdatedEvent {
  event_type: "chat_state_updated";
  chat_id: string;
  state: ChatState;
}

/**
 * Input event for creating a new chat message via WebSocket
 */
export interface CreateChatMessageEvent {
  event_type: "create_chat_message";
  chat_id: string;
  content: string;
  attachments?: AttachmentUpload[];
}

/**
 * Chat message object
 */
export interface ChatMessage {
  id: string;
  chat_id: string;
  message_type: MessageType;
  content: string;
  attachments?: AttachmentUpload[];
  created_at: string;
  user_id?: string;
}

/**
 * Event emitted when a new chat message is created
 */
export interface ChatMessageCreatedEvent {
  event_type: "chat_message_created";
  chat_id: string;
  message: ChatMessage;
}

/**
 * Task message object
 */
export interface TaskMessage {
  id: string;
  task_id: string;
  message_type: MessageType;
  message_id: string;
  content: string;
}

/**
 * Event emitted when a new task message is created
 */
export interface TaskMessageCreatedEvent {
  event_type: "task_message_created";
  task_id: string;
  message: TaskMessage;
}

/**
 * Event emitted when a task state changes
 */
export interface TaskStateUpdatedEvent {
  event_type: "task_state_updated";
  task_id: string;
  old_state: TaskState;
  new_state: TaskState;
}

/**
 * Input event for creating a new task message via WebSocket
 */
export interface CreateTaskMessageEvent {
  event_type: "create_task_message";
  task_id: string;
  content: string;
  message_type?: MessageType;
}

/**
 * Union type of all possible WebSocket events
 */
export type WebSocketEvent =
  | ChatStateUpdatedEvent
  | CreateChatMessageEvent
  | ChatMessageCreatedEvent
  | TaskMessageCreatedEvent
  | TaskStateUpdatedEvent
  | CreateTaskMessageEvent;
