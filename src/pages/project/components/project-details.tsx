import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GitBranch, Calendar } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { ProjectResponse } from "@/api/models";
import { formatDistanceToNow } from "date-fns";

interface ProjectDetailsProps {
  project: ProjectResponse;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const formattedDate = formatDistanceToNow(
    new Date(project.project.created_at),
    {
      addSuffix: true,
    },
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold mb-1">{project.project.name}</h1>
        <a
          href={project.project.repository?.remote.urls[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary flex items-center gap-1.5"
        >
          <FiGithub className="h-4 w-4" />
          {project.project.repository?.remote.urls[0]}
        </a>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <FiGithub className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Repository</p>
                  <a
                    href={project.project.repository?.remote.urls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary break-all"
                  >
                    {project.project.repository?.remote.urls[0]}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Branch/Reference</p>
                  <p className="text-sm text-muted-foreground">
                    {project.project.repository?.active_branch ?? "master"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Team Members</h3>
              {project.project.users.length > 0 ? (
                <div className="space-y-3">
                  {project.project.users.map((user) => (
                    <div key={user.user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No team members</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
