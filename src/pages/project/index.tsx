import { useParams, Link, useSearchParams } from "react-router";
import { useGetProject } from "@/api/endpoints/project/project.gen";
import { ProjectDetails } from "./components/project-details";
import { ProjectTasks } from "./components/project-tasks";
import { ProjectSkeleton } from "./components/project-skeleton";
import { ProjectError } from "./components/project-error";
import { Button } from "@/components/ui/button";
import {
  Settings,
  RefreshCw,
  Home,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function ProjectPage() {
  const { projectId } = useParams() as { projectId: string };
  const [searchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get current tab from URL params, default to 'overview'
  const currentTab = searchParams.get("tab") ?? "overview";

  const {
    data: projectData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProject(projectId);

  // Refresh function for tasks
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    void refetch().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    });
  }, [refetch]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (isError) {
    return <ProjectError error={error} />;
  }

  if (!projectData?.data) {
    return <ProjectError error={new Error("Project not found")} />;
  }

  const project = projectData.data;

  // GitHub-style tab navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.project.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh project data"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            </Button>

            <Button variant="outline" asChild>
              <Link to={`/projects/${projectId}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* GitHub-style Navigation */}
        <nav className="border-b border-border">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <Link
                  key={item.id}
                  to={`?tab=${item.id}`}
                  className={cn(
                    "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Content based on current tab */}
        {currentTab === "overview" && (
          <div className="space-y-6">
            <ProjectDetails project={project} />
          </div>
        )}

        {currentTab === "tasks" && (
          <div className="space-y-6">
            <ProjectTasks
              projectId={project.project.id}
              tasks={project.project.tasks}
              onRefresh={handleRefresh}
            />
          </div>
        )}

        {currentTab === "chats" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium">Chats</h3>
              <p className="text-muted-foreground mt-2">
                Chat functionality coming soon
              </p>
            </div>
          </div>
        )}

        {currentTab === "settings" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium">Project Settings</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Configure your project settings
              </p>
              <Button asChild>
                <Link to={`/projects/${projectId}/settings`}>
                  Open Settings Page
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
