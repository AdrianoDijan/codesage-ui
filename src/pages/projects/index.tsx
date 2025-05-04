import { useGetProjects } from "@/api/endpoints/users/users.gen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCreationDialog } from "@/components/projects/project-creation-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { ProjectsList } from "./components/projects-list";
import { useState, useMemo } from "react";
import { ProjectsTable } from "./components/projects-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProjectAnalytics } from "./components/project-analytics";

export default function ProjectsPage() {
  const { data: projectsData, isLoading: isLoadingProjects } =
    useGetProjects("me");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projectStatus, setProjectStatus] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [showAnalytics, setShowAnalytics] = useState(true);

  const filteredProjects = useMemo(() => {
    if (!projectsData?.data.projects) return [];

    let filtered = [...projectsData.data.projects];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.repository?.remote.urls[0].toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "tasks":
          return b.tasks.length - a.tasks.length;
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "updated":
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });

    return filtered;
  }, [projectsData, searchQuery, sortBy]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projects</h1>
          <ProjectCreationDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Project
              </Button>
            }
          />
        </div>

        {showAnalytics && projectsData?.data.projects && (
          <ProjectAnalytics
            projects={projectsData.data.projects}
            isLoading={isLoadingProjects}
          />
        )}

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Tabs value={projectStatus} onValueChange={setProjectStatus}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="tasks">Task Count</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => {
                if (value) {
                  setViewMode(value as "grid" | "list");
                }
              }}
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAnalytics(!showAnalytics);
              }}
            >
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <ProjectsList
            projects={filteredProjects}
            isLoading={isLoadingProjects}
          />
        ) : (
          <ProjectsTable
            projects={filteredProjects}
            isLoading={isLoadingProjects}
          />
        )}

        {!isLoadingProjects && filteredProjects.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No projects matching "{searchQuery}"
            </p>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => {
                setSearchQuery("");
              }}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
