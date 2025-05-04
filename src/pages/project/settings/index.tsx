import { useParams } from "react-router";
import { useGetProject } from "@/api/endpoints/project/project.gen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectIntegrations } from "./components/project-integrations";
import { ProjectGeneral } from "./components/project-general";

export default function ProjectSettingsPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: projectData, isLoading, isError } = useGetProject(projectId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (isError || !projectData?.data) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Project not found or failed to load
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const project = projectData.data.project;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name} Settings</h1>
          <p className="text-muted-foreground">
            Manage your project configuration and integrations
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <ProjectGeneral project={project} />
          </TabsContent>

          <TabsContent value="integrations">
            <ProjectIntegrations projectId={projectId} />
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Project Members</CardTitle>
                <CardDescription>
                  Manage who has access to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.users.map((user) => (
                    <div
                      key={user.user.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{user.user.username}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
