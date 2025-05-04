import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Loader2, Plus, ExternalLink } from "lucide-react";
import { FiGithub, FiGitlab } from "react-icons/fi";
import {
  useGetIntegrationBindingCandidates,
  useCreateIntegrationBinding,
  useGetProject,
} from "@/api/endpoints/project/project.gen";
import {
  IntegrationProviders,
  IntegrationProtocol,
  BindingCandidateSchema,
  IntegrationsResponseIntegrationsItem,
} from "@/api/models";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddIntegrationBindingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  integrations: IntegrationsResponseIntegrationsItem[];
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

const ALL_PROVIDERS = Object.values(IntegrationProviders);

export function AddIntegrationBindingDialog({
  open,
  onOpenChange,
  projectId,
  integrations,
}: AddIntegrationBindingDialogProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<
    { candidate: BindingCandidateSchema; integrationId: string }[]
  >([]);

  const queryClient = useQueryClient();

  const createBinding = useCreateIntegrationBinding({
    mutation: {
      onSuccess: () => {
        toast.success("Integration bindings added successfully");
        setSelectedCandidates([]);
        onOpenChange(false);

        queryClient
          .invalidateQueries({
            queryKey: [`/api/projects/${projectId}/integration-bindings`],
          })
          .catch((error: unknown) => {
            console.error(error);
          });
      },
      onError: (error) => {
        toast.error("Failed to add integration bindings");
        console.error(error);
      },
    },
  });

  // Map provider to integration (if user has it)
  const providerToIntegration: Record<
    string,
    IntegrationsResponseIntegrationsItem | undefined
  > = {};
  for (const integration of integrations) {
    providerToIntegration[integration.provider as string] = integration;
  }

  // Default to first available provider
  const defaultTab = ALL_PROVIDERS[0];

  const handleToggleCandidate = (
    candidate: BindingCandidateSchema,
    integrationId: string,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedCandidates((prev) => [...prev, { candidate, integrationId }]);
    } else {
      setSelectedCandidates((prev) =>
        prev.filter(
          (item) =>
            !(
              item.candidate.remote_id === candidate.remote_id &&
              item.candidate.provider === candidate.provider &&
              item.integrationId === integrationId
            ),
        ),
      );
    }
  };

  const handleSubmit = () => {
    if (selectedCandidates.length === 0) {
      toast.error("Please select at least one binding");
      return;
    }

    const bindings = selectedCandidates.map(({ candidate, integrationId }) => ({
      protocol: candidate.protocol,
      remote_id: candidate.remote_id,
      integration_id: integrationId,
    }));

    createBinding.mutate({
      projectId,
      data: { bindings },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Integration Bindings</DialogTitle>
          <DialogDescription>
            Select resources from your integrations to bind to this project
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="flex w-full overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
            {ALL_PROVIDERS.map((provider) => {
              const Icon = providerIcons[provider];
              return (
                <TabsTrigger
                  key={provider}
                  value={provider}
                  className="flex items-center gap-2 min-w-[120px]"
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{provider}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {ALL_PROVIDERS.map((provider) => {
            const integration = providerToIntegration[provider];
            return (
              <TabsContent key={provider} value={provider} className="mt-4">
                {integration ? (
                  <IntegrationCandidates
                    integration={integration}
                    projectId={projectId}
                    selectedCandidates={selectedCandidates}
                    onToggleCandidate={handleToggleCandidate}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-2">
                      No {provider} integration found
                    </h3>
                    <p className="text-muted-foreground mb-4 text-center">
                      You need to set up a {provider} integration before you can
                      bind resources from it.
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/integrations">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Set up Integration
                      </a>
                    </Button>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedCandidates.length} bindings selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                selectedCandidates.length === 0 || createBinding.isPending
              }
            >
              {createBinding.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Add Bindings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface IntegrationCandidatesProps {
  integration: IntegrationsResponseIntegrationsItem;
  projectId: string;
  selectedCandidates: {
    candidate: BindingCandidateSchema;
    integrationId: string;
  }[];
  onToggleCandidate: (
    candidate: BindingCandidateSchema,
    integrationId: string,
    checked: boolean,
  ) => void;
}

function IntegrationCandidates({
  integration,
  projectId,
  selectedCandidates,
  onToggleCandidate,
}: IntegrationCandidatesProps) {
  const project = useGetProject(projectId);
  const { data: candidatesData, isLoading } =
    useGetIntegrationBindingCandidates(projectId, {
      integration_id: integration.id,
      query:
        project.data?.data.project.repository?.remote.urls[0]
          ?.split("/")
          .pop() ?? "",
    });

  const candidates = candidatesData?.data.candidates ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((value) => (
          <div key={value} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No bindable resources found for this integration
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-64">
      <div className="space-y-3">
        {candidates.map((candidate) => {
          const isSelected = selectedCandidates.some(
            (item) =>
              item.candidate.remote_id === candidate.remote_id &&
              item.candidate.provider === candidate.provider &&
              item.integrationId === integration.id,
          );

          const protocolLabel =
            protocolLabels[candidate.protocol] || candidate.protocol;

          return (
            <div
              key={`${candidate.provider}-${candidate.remote_id}`}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  onToggleCandidate(candidate, integration.id, !!checked);
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{candidate.remote_id}</span>
                  <Badge variant="outline">{protocolLabel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {candidate.provider}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
