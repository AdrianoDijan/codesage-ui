import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import StateButton from "@/components/state-button";
import { useCreateIntegration } from "@/api/endpoints/integrations/integrations.gen";
import { useQueryClient } from "@tanstack/react-query";
import {
  IntegrationCreateRequest,
  HTTPValidationError,
  IntegrationProviders,
} from "@/api/models";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/api/endpoints/users/users.gen";
import { getErrorMessage } from "@/lib/error";

// Base schema - will be extended by provider-specific schemas
const baseIntegrationFormSchema = z.object({
  name: z.string().min(1, "Integration name is required"),
  provider: z.nativeEnum(IntegrationProviders),
});

// Single form schema that includes all possible fields
const integrationFormSchema = baseIntegrationFormSchema.extend({
  config_base_url: z.string().optional(),
  secret_token: z.string().min(1, "Token is required"),
});

export type IntegrationFormData = z.infer<typeof integrationFormSchema>;

interface IntegrationCreationDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function IntegrationCreationDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: IntegrationCreationDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();

  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationFormSchema), // Use single schema
    mode: "onChange",
    defaultValues: {
      provider: IntegrationProviders.github, // Default to GitHub
      config_base_url: "",
      secret_token: "",
    },
  });

  const selectedProvider = form.watch("provider");

  useEffect(() => {
    form.setValue("config_base_url", "");
    form.setValue("secret_token", "");
  }, [selectedProvider, form]);

  const createIntegration = useCreateIntegration({
    mutation: {
      onSuccess: async (response) => {
        await queryClient.invalidateQueries({
          queryKey: ["/api/users/me/integrations"],
        });
        toast.success(
          `Integration '${response.data.integration.name}' created successfully`,
        );
        setTimeout(() => {
          setOpen(false);
          form.reset();
          if (onSuccess) onSuccess();
        }, 1500);
      },
      onError: (error: AxiosError<HTTPValidationError>) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        provider: IntegrationProviders.github,
        config_base_url: "",
        secret_token: "",
      }); // Reset form when dialog closes
    }
  }, [open, form]);

  const onSubmit = (data: IntegrationFormData) => {
    getUserInfo("me")
      .then((response) => {
        const userId = response.data.user.id;
        const integrationPayload: IntegrationCreateRequest["integration"] = {
          provider: data.provider,
          name: data.name,
          config: {
            base_url:
              data.config_base_url && data.config_base_url.trim() !== ""
                ? data.config_base_url
                : undefined,
          },
          secret: {
            type: "token",
            value: { token: data.secret_token },
          },
          owner: {
            id: userId,
            type: "user",
          },
        };
        createIntegration.mutate({ data: { integration: integrationPayload } });
      })
      .catch((error: unknown) => {
        toast.error(error as string);
      });
  };

  const renderProviderSpecificFields = () => {
    switch (selectedProvider) {
      case IntegrationProviders.github:
        return (
          <>
            <FormField
              control={form.control}
              name="config_base_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Base URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your main GitHub URL (e.g., for GitHub Enterprise).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secret_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Personal Access Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your GitHub PAT"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Requires 'repo' and 'admin:org' scopes if applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case IntegrationProviders.sentry:
        return (
          <>
            <FormField
              control={form.control}
              name="config_base_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sentry Base URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://sentry.io"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your Sentry instance URL (e.g., https://sentry.io or
                    self-hosted).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secret_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sentry Auth Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your Sentry Auth Token"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Ensure it has necessary permissions (e.g., org:read,
                    project:releases).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case IntegrationProviders.gitlab:
        return (
          <>
            <FormField
              control={form.control}
              name="config_base_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitLab Base URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://gitlab.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your GitLab instance URL (e.g., https://gitlab.com or
                    self-hosted).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secret_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitLab Personal Access Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your GitLab PAT"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Requires 'api' and 'read_repository' scopes if applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Please select a provider.
          </p>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Integration</DialogTitle>
          <DialogDescription>
            Connect a new service to enhance your CodeSage experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(IntegrationProviders).map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My GitHub Connection"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    A friendly name for this integration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderProviderSpecificFields()}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <StateButton
                type="submit"
                disabled={
                  createIntegration.isPending || !form.formState.isValid
                }
                variant={
                  createIntegration.isPending
                    ? "loading"
                    : createIntegration.isSuccess
                      ? "success"
                      : createIntegration.isError
                        ? "error"
                        : "default"
                }
              >
                Create Integration
              </StateButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
