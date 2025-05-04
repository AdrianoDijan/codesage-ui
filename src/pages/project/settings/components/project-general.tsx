import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Calendar, Users } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { ProjectSchema } from "@/api/models";
import { formatDistanceToNow } from "date-fns";

interface ProjectGeneralProps {
  project: ProjectSchema;
}

export function ProjectGeneral({ project }: ProjectGeneralProps) {
  const formattedDate = formatDistanceToNow(new Date(project.created_at), {
    addSuffix: true,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Basic information about this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Project ID</label>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {project.id}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Created</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Total Tasks</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{project.tasks.length}</p>
                  <Badge variant="secondary">tasks</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Team Members</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {project.users.length} member
                    {project.users.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {project.repository && (
        <Card>
          <CardHeader>
            <CardTitle>Repository Information</CardTitle>
            <CardDescription>Source code repository details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Repository URL</label>
              <div className="flex items-center gap-2 mt-1">
                <FiGithub className="h-4 w-4 text-muted-foreground" />
                <a
                  href={project.repository.remote.urls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {project.repository.remote.urls[0]}
                </a>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Active Branch</label>
              <div className="flex items-center gap-2 mt-1">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {project.repository.active_branch || "main"}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
