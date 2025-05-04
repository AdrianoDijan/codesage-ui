import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, Trash2, ExternalLink } from "lucide-react";
import { FiGithub, FiGitlab } from "react-icons/fi";
import { useGetIntegrationBindings } from "@/api/endpoints/project/project.gen";
import { useGetIntegrations } from "@/api/endpoints/users/users.gen";
import { IntegrationProviders, IntegrationProtocol } from "@/api/models";
import { AddIntegrationBindingDialog } from "./add-integration-binding-dialog";

interface ProjectIntegrationsProps {
  projectId: string;
}

const providerIcons = {
  [IntegrationProviders.github]: FiGithub,
  [IntegrationProviders.gitlab]: FiGitlab,
  [IntegrationProviders.sentry]: AlertTriangle,
};

const protocolLabels = {
  [IntegrationProtocol.repository]: "Repository",
  [IntegrationProtocol.ci]: "CI/CD",
  [IntegrationProtocol.error_monitoring]: "Error Monitoring",
};

export function ProjectIntegrations({ projectId }: ProjectIntegrationsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: bindingsData, isLoading: isLoadingBindings } =
    useGetIntegrationBindings(projectId);
  const { data: integrationsData } = useGetIntegrations("me");

  const bindings = bindingsData?.data.bindings ?? [];
  const hasIntegrations =
    integrationsData?.data.integrations &&
    integrationsData.data.integrations.length > 0;

  if (isLoadingBindings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integration Bindings</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((value) => (
              <div
                key={value}
                className="h-16 bg-muted animate-pulse rounded"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Integration Bindings</CardTitle>
            <CardDescription>
              Connect this project to external services and repositories
            </CardDescription>
          </div>
          {hasIntegrations && (
            <Button
              onClick={() => {
                setShowAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Binding
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!hasIntegrations ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No Integrations Available
              </h3>
              <p className="text-muted-foreground mb-4">
                You need to set up integrations first before you can bind them
                to projects.
              </p>
              <Button variant="outline" asChild>
                <a href="/integrations">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Integrations
                </a>
              </Button>
            </div>
          ) : bindings.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Bindings Yet</h3>
              <p className="text-muted-foreground mb-4">
                Connect this project to your configured integrations.
              </p>
              <Button
                onClick={() => {
                  setShowAddDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Binding
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bindings.map((binding) => {
                const Icon = providerIcons[binding.provider];
                const protocolLabel = protocolLabels[binding.protocol];

                return (
                  <div
                    key={binding.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {binding.provider}
                          </span>
                          <Badge variant="secondary">{protocolLabel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {binding.remote_id}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {hasIntegrations && (
        <AddIntegrationBindingDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          projectId={projectId}
          integrations={integrationsData.data.integrations}
        />
      )}
    </div>
  );
}
