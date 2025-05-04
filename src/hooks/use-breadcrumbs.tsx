import { useAppContext } from "@/hooks/use-app-context";
import { useMemo } from "react";

// Define breadcrumb routes configuration
const breadcrumbConfig = {
  projects: {
    path: "/projects",
    label: "Projects",
    children: {
      detail: {
        getPath: (id: string) => `/projects/${id}`,
        getLabel: (id: string, projects: { id: string; name: string }[]) => {
          const project = projects.find((p) => p.id === id);
          return project?.name ?? `Project ${id}`;
        },
        children: {
          tasks: {
            path: (id: string) => `/projects/${id}/tasks`,
            label: "Tasks",
          },
          chats: {
            path: (id: string) => `/projects/${id}/chats`,
            label: "Chats",
          },
        },
      },
    },
  },
  task: {
    path: (projectId: string, taskId: string) =>
      `/projects/${projectId}/tasks/${taskId}`,
    label: (taskId: string) => `Task #${taskId}`,
    breadcrumbs: (
      projectId: string,
      taskId: string,
      projects: { id: string; name: string }[],
    ) => [
      { path: "/projects", label: "Projects" },
      {
        path: `/projects/${projectId}`,
        label: (() => {
          const project = projects.find((p) => p.id === projectId);
          return project?.name ?? `Project ${projectId}`;
        })(),
      },
      { path: `/projects/${projectId}/tasks`, label: "Tasks" },
      { path: null, label: `Task #${taskId}` },
    ],
  },
  integrations: {
    path: "/integrations",
    label: "Integrations",
    children: {
      bindings: { label: "Bindings" },
      "api-keys": { label: "API Keys" },
    },
  },
  account: {
    path: "/account",
    label: "Account",
  },
};

export interface Breadcrumb {
  path: string | null;
  label: string;
}

export function useBreadcrumbs(
  projects: { id: string; name: string }[] = [],
): Breadcrumb[] {
  const context = useAppContext();

  // Helper to fetch a project name once
  const getProjectName = (projectId?: string): string => {
    if (!projectId) return "";
    const project = projects.find((p) => p.id === projectId);
    return project?.name ?? `Project ${projectId}`;
  };

  return useMemo(() => {
    const crumbs: Breadcrumb[] = [{ path: "/", label: "Home" }];

    switch (context.type) {
      case "projects": {
        crumbs.push({
          path: context.subcontext === "list" ? null : "/projects",
          label: "Projects",
        });

        if (context.projectId) {
          const projectLabel = getProjectName(context.projectId);
          crumbs.push({
            path:
              context.subcontext === "detail"
                ? null
                : `/projects/${context.projectId}`,
            label: projectLabel,
          });

          if (
            context.subcontext === "tasks" ||
            context.subcontext === "chats"
          ) {
            crumbs.push({
              path: null,
              label: context.subcontext === "tasks" ? "Tasks" : "Chats",
            });
          }
        }

        break;
      }

      case "task": {
        if (!context.projectId || !context.taskId) break;
        const projectId = context.projectId;
        const taskId = context.taskId;

        crumbs.push({ path: "/projects", label: "Projects" });
        crumbs.push({
          path: `/projects/${projectId}`,
          label: getProjectName(projectId),
        });
        crumbs.push({
          path: `/projects/${projectId}/tasks`,
          label: "Tasks",
        });
        crumbs.push({ path: null, label: `Task #${taskId}` });

        break;
      }

      case "integrations": {
        crumbs.push({
          path: context.subcontext === "list" ? null : "/integrations",
          label: "Integrations",
        });

        if (context.subcontext && context.subcontext !== "list") {
          const labelMap: Record<string, string> = {
            bindings: "Bindings",
            "api-keys": "API Keys",
          };
          const label = labelMap[context.subcontext] ?? context.subcontext;
          crumbs.push({ path: null, label });
        }
        break;
      }

      case "account": {
        crumbs.push({ path: null, label: "Account" });
        break;
      }
    }

    return crumbs;
  }, [context, projects]);
}
