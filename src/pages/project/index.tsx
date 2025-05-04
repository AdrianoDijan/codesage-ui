import { useParams } from "react-router";
import { useGetProject } from "@/api/endpoints/project/project.gen";
import { ProjectDetails } from "./components/project-details";
import { ProjectTasks } from "./components/project-tasks";
import { ProjectSkeleton } from "./components/project-skeleton";
import { ProjectError } from "./components/project-error";

export default function ProjectPage() {
  const { projectId } = useParams() as { projectId: string };
  const {
    data: projectData,
    isLoading,
    isError,
    error,
  } = useGetProject(projectId);

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

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col space-y-8">
        <ProjectDetails project={project} />
        <ProjectTasks projectId={project.id} tasks={project.tasks} />
      </div>
    </div>
  );
}
