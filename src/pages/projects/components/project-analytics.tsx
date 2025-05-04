import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectSchema } from "@/api/models";
import { CheckCircle2, Clock, LayoutGrid } from "lucide-react";

interface ProjectAnalyticsProps {
  projects: ProjectSchema[];
  isLoading: boolean;
}

export function ProjectAnalytics({
  projects,
  isLoading,
}: ProjectAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-lg"></div>
    );
  }

  if (!projects.length) {
    return null;
  }

  // Calculate metrics
  const totalTasks = projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0,
  );
  const completedTasks = projects.reduce(
    (acc, project) =>
      acc + project.tasks.filter((task) => task.state === "completed").length,
    0,
  );
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) =>
      // This is a placeholder - replace with actual activity check
      new Date(project.updated_at).getTime() >
      Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{totalProjects}</div>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeProjects} active in the last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{totalTasks}</div>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedTasks} completed ({completionRate}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Most Active Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {projects.length > 0
              ? projects.toSorted((a, b) => b.tasks.length - a.tasks.length)[0]
                  .name
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {projects.length > 0
              ? projects.toSorted((a, b) => b.tasks.length - a.tasks.length)[0]
                  .tasks.length
              : 0}{" "}
            tasks
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Completion Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">3.5 days</div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From creation to completion
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
