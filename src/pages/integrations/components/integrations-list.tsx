import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Cog, Trash2 } from "lucide-react";
import {
  IntegrationGithubSchema,
  IntegrationSentrySchema,
  IntegrationGitlabSchema,
  IntegrationsResponseIntegrationsItem,
} from "@/api/models";
import { useDeleteIntegration } from "@/api/endpoints/integrations/integrations.gen";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap, GitBranch } from "lucide-react"; // Added GitBranch for GitLab
import { FiGithub } from "react-icons/fi";

interface IntegrationsListProps {
  integrations: IntegrationsResponseIntegrationsItem[];
  isLoading: boolean;
}

const ProviderIcon = ({ provider }: { provider?: string }) => {
  switch (provider) {
    case "github":
      return <FiGithub className="h-5 w-5 text-primary" />;
    case "sentry":
      return <Zap className="h-5 w-5 text-primary" />;
    case "gitlab":
      return <GitBranch className="h-5 w-5 text-primary" />;
    default:
      return <Cog className="h-5 w-5 text-muted-foreground" />;
  }
};

export function IntegrationsList({
  integrations,
  isLoading,
}: IntegrationsListProps) {
  const queryClient = useQueryClient();
  const deleteIntegrationMutation = useDeleteIntegration({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["/api/users/me/integrations"],
        });
        toast.success("Integration deleted successfully");
      },
      onError: (error) => {
        toast.error(
          `Failed to delete integration: ${error.message || "Unknown error"}`,
        );
      },
    },
  });

  const handleDelete = (integrationId: string) => {
    // TODO: Add a confirmation dialog before deleting
    deleteIntegrationMutation.mutate({ integrationId });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((value) => (
          <IntegrationCardSkeleton key={value} />
        ))}
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <Alert>
        <Cog className="h-4 w-4" />
        <AlertTitle>No Integrations Found</AlertTitle>
        <AlertDescription>
          You haven't configured any integrations yet. Click "New Integration"
          to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onDelete={handleDelete}
          isDeleting={
            deleteIntegrationMutation.isPending &&
            deleteIntegrationMutation.variables.integrationId === integration.id
          }
        />
      ))}
    </div>
  );
}

function IntegrationCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

interface IntegrationCardProps {
  integration: IntegrationsResponseIntegrationsItem;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function IntegrationCard({
  integration,
  onDelete,
  isDeleting,
}: IntegrationCardProps) {
  // Type guard to narrow down the integration type
  const isGithub = (
    int: IntegrationsResponseIntegrationsItem,
  ): int is IntegrationGithubSchema => int.provider === "github";
  const isSentry = (
    int: IntegrationsResponseIntegrationsItem,
  ): int is IntegrationSentrySchema => int.provider === "sentry";
  const isGitlab = (
    int: IntegrationsResponseIntegrationsItem,
  ): int is IntegrationGitlabSchema => int.provider === "gitlab";

  let description = "Unknown integration type";
  let details: Record<string, string | undefined> = {};

  if (isGithub(integration)) {
    description = `GitHub Integration - ${integration.owner?.name ?? "User Owned"}`;
    details = {
      "API URL": integration.config.api_url,
      "Base URL": integration.config.base_url ?? "Default",
    };
  } else if (isSentry(integration)) {
    description = `Sentry Integration - ${integration.owner?.name ?? "User Owned"}`;
    details = {
      "Base URL": integration.config.base_url ?? "Default Sentry URL",
    };
  } else if (isGitlab(integration)) {
    description = `GitLab Integration - ${integration.owner?.name ?? "User Owned"}`;
    details = {
      "Base URL": integration.config.base_url ?? "Default GitLab URL",
    };
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProviderIcon provider={integration.provider} />
            <CardTitle className="truncate text-lg">
              {integration.name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onDelete(integration.id);
            }}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 text-sm">
        {Object.entries(details).map(
          ([key, value]) =>
            value && (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{key}:</span>
                <span className="truncate">{value}</span>
              </div>
            ),
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Auth Secret:</span>
          <span className="truncate">
            Configured ({integration.secret.type})
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" className="w-full" disabled>
          {" "}
          {/* Edit functionality to be added */}
          <Cog className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </CardFooter>
    </Card>
  );
}
