import { useGetProjects } from "@/api/endpoints/users/users.gen";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Code,
  ExternalLink,
  FolderGit2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { ProjectSchema } from "@/api/models";
import { ProjectCreationDialog } from "@/components/projects/project-creation-dialog";

export function ProjectsList() {
  const { data: projectsData, isLoading: isLoadingProjects } =
    useGetProjects("me");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <ProjectCreationDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </Button>
          }
        />
      </div>

      {isLoadingProjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((value) => (
            <ProjectCardSkeleton key={value} />
          ))}
        </div>
      ) : projectsData?.data.projects.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectsData.data.projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {projectsData.data.projects.length > 3 && (
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects" className="flex items-center">
                  Show All Projects
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyProjectsState />
      )}
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-full mt-1" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex -space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

function EmptyProjectsState() {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
      <FolderGit2 className="h-12 w-12 text-muted-foreground/60" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-sm text-muted-foreground">
          You don't have any projects yet. Create a new project to get started.
        </p>
      </div>
      <ProjectCreationDialog
        trigger={
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Create Project
          </Button>
        }
      />
    </Card>
  );
}

function ProjectCard({ project }: { project: ProjectSchema }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FolderGit2 className="text-primary h-5 w-5" />
          <CardTitle className="truncate text-lg">{project.name}</CardTitle>
        </div>
        <CardDescription className="truncate text-xs">
          {project.repository?.remote.urls[0]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {project.tasks.length}{" "}
              {project.tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>
          {project.users.length > 0 && (
            <div className="flex -space-x-2">
              {project.users.slice(0, 3).map((user) => (
                <Avatar
                  key={user.user.id}
                  className="h-6 w-6 border-2 border-background"
                >
                  <AvatarFallback className="text-xs">
                    {user.user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.users.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{project.users.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/projects/${project.id}`}>
            <span>Open Project</span>
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
