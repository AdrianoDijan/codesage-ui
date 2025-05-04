import { useLocation } from "react-router";

export type AppContext =
  | { type: "home" }
  | {
      type: "projects";
      subcontext?: "list" | "detail" | "tasks" | "chats";
      projectId?: string;
    }
  | { type: "task"; taskId: string; projectId: string }
  | { type: "integrations"; subcontext?: "list" | "bindings" | "api-keys" }
  | { type: "account" };

export function useAppContext(): AppContext {
  const location = useLocation();

  // Parse the current route to determine context
  if (location.pathname === "/") {
    return { type: "home" };
  }

  if (location.pathname.startsWith("/projects")) {
    const segments = location.pathname.split("/").filter(Boolean);

    if (segments.length === 1) {
      return { type: "projects", subcontext: "list" };
    }

    if (segments.length === 2) {
      return { type: "projects", subcontext: "detail", projectId: segments[1] };
    }

    if (segments.length === 3 && segments[2] === "tasks") {
      return { type: "projects", subcontext: "tasks", projectId: segments[1] };
    }

    if (segments.length === 4 && segments[2] === "tasks") {
      return { type: "task", taskId: segments[3], projectId: segments[1] };
    }

    if (segments.length === 3 && segments[2] === "chats") {
      return { type: "projects", subcontext: "chats", projectId: segments[1] };
    }

    // Default to detail view for any other project subroute
    if (segments.length >= 2) {
      return { type: "projects", subcontext: "detail", projectId: segments[1] };
    }
  }

  if (location.pathname.startsWith("/integrations")) {
    const segments = location.pathname.split("/").filter(Boolean);

    if (segments.length === 1) {
      return { type: "integrations", subcontext: "list" };
    }

    if (segments.length === 2 && segments[1] === "bindings") {
      return { type: "integrations", subcontext: "bindings" };
    }

    if (segments.length === 2 && segments[1] === "api-keys") {
      return { type: "integrations", subcontext: "api-keys" };
    }

    return { type: "integrations", subcontext: "list" };
  }

  if (location.pathname.startsWith("/account")) {
    return { type: "account" };
  }

  return { type: "home" }; // fallback
}
