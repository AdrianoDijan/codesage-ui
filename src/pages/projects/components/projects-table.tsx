import { ProjectSchema } from "@/api/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Archive,
  Code,
  ExternalLink,
  FolderGit2,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectsTableProps {
  projects: ProjectSchema[];
  isLoading: boolean;
}

export function ProjectsTable({ projects, isLoading }: ProjectsTableProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const toggleSelectAll = useCallback(() => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((project) => project.id));
    }
  }, [selectedProjects.length, projects]);

  const toggleProjectSelection = useCallback((projectId: string) => {
    setSelectedProjects((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  }, []);

  const handleBulkAction = useCallback(
    (action: string) => {
      console.log(`Performing ${action} on:`, selectedProjects);
      // Implement actual bulk actions here

      // Clear selection after action
      setSelectedProjects([]);
    },
    [selectedProjects],
  );

  if (isLoading) {
    return <ProjectsTableSkeleton />;
  }

  if (!projects.length) {
    return (
      <div className="text-center py-12">
        <FolderGit2 className="h-12 w-12 text-muted-foreground/60 mx-auto" />
        <h3 className="mt-4 text-lg font-medium">No projects found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          No projects match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedProjects.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {selectedProjects.length} projects selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleBulkAction("archive");
              }}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleBulkAction("share");
              }}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add Collaborators
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedProjects([]);
              }}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedProjects.length === projects.length &&
                    projects.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all projects"
                />
              </TableHead>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Contributors</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className={
                  selectedProjects.includes(project.id) ? "bg-muted/50" : ""
                }
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => {
                      toggleProjectSelection(project.id);
                    }}
                    aria-label={`Select ${project.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FolderGit2 className="text-primary h-5 w-5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[240px]">
                        {project.repository?.remote.urls[0]}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span>{project.tasks.length}</span>
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {(new Date(project.updated_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {format(new Date(project.created_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/projects/${project.id}`}>
                        <span>Open</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit project</DropdownMenuItem>
                        <DropdownMenuItem>Manage users</DropdownMenuItem>
                        <DropdownMenuItem>Export data</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Archive project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProjectsTableSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox disabled />
            </TableHead>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Contributors</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((value) => (
            <TableRow key={value}>
              <TableCell>
                <Checkbox disabled />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-9 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
