import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GitBranch, Calendar, Github, Users } from "lucide-react";
import { ProjectResponse } from "@/api/models";
import { formatDistanceToNow } from "date-fns";

interface ProjectDetailsProps {
  project: ProjectResponse;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const formattedDate = formatDistanceToNow(new Date(project.created_at), {
    addSuffix: true,
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant="outline" className="flex items-center gap-1 mt-1.5">
              <Users className="h-3.5 w-3.5" />
              {project.users.length}{" "}
              {project.users.length === 1 ? "User" : "Users"}
            </Badge>
          </div>
          <a
            href={project.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary flex items-center gap-1.5"
          >
            <Github className="h-4 w-4" />
            {project.repository.url}
          </a>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Project Information</CardTitle>
          <CardDescription>
            Details about this project and its repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Github className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Repository</p>
                  <a
                    href={project.repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary break-all"
                  >
                    {project.repository.url}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Branch/Reference</p>
                  <p className="text-sm text-muted-foreground">
                    {project.repository.reference || "master"}
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
              {project.users.length > 0 ? (
                <div className="space-y-3">
                  {project.users.map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
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
