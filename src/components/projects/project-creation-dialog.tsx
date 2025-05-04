import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { useCreateProject } from "@/api/endpoints/project/project.gen";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { CreateProjectRequest, HTTPValidationError } from "@/api/models";
import { AxiosError } from "axios";

const projectFormSchema = z
  .object({
    repositoryUrl: z
      .string()
      .min(1, "Repository URL is required")
      .url("Must be a valid URL"),
    name: z.string().optional(),
    reference: z.string().optional(),
    useCredentials: z.boolean(),
    username: z.string().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // If useCredentials is true, both username and password are required
      if (data.useCredentials) {
        return !!data.username && !!data.password;
      }
      return true;
    },
    {
      message: "Username and password are required when using credentials",
      path: ["username"],
    },
  );

export type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectCreationDialogProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function ProjectCreationDialog({
  trigger,
  onSuccess,
}: ProjectCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      useCredentials: false,
    },
  });

  const createProject = useCreateProject({
    mutation: {
      onSuccess: async () => {
        // Invalidate the projects query to refresh the projects list
        await queryClient.invalidateQueries({
          queryKey: ["/api/users/me/projects"],
        });

        toast.success("Project created successfully");
        setTimeout(() => {
          setOpen(false);
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      },
      onError: (error: AxiosError<HTTPValidationError>) => {
        // Default error message
        let message = "Failed to create project";

        try {
          // Try to extract a more specific error message if available
          if (error.response?.data) {
            const { detail } = error.response.data;
            if (detail) {
              message = Array.isArray(detail)
                ? detail.map(String).join(", ")
                : String(detail);
            }
          }
        } catch {
          // If anything goes wrong, use the default message
        }

        toast.error(message);
      },
    },
  });

  // Watch for changes to the useCredentials checkbox to enable/disable validation
  const useCredentials = form.watch("useCredentials");

  // Reset username and password when useCredentials is toggled off
  useEffect(() => {
    if (!useCredentials) {
      form.setValue("username", "");
      form.setValue("password", "");
    }
  }, [useCredentials, form]);

  // Extract repository name from URL for the default project name
  const repositoryUrl = form.watch("repositoryUrl");
  useEffect(() => {
    if (repositoryUrl && !form.getValues("name")) {
      try {
        const url = new URL(repositoryUrl);
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2) {
          // Get the last part of the path (repository name) and remove .git extension
          const repoName = pathParts[pathParts.length - 1].replace(
            /\.git$/,
            "",
          );
          form.setValue("name", repoName);
        }
      } catch {
        console.log("error");
      }
    }
  }, [repositoryUrl, form]);

  function onSubmit(data: ProjectFormData) {
    const payload: CreateProjectRequest = {
      project: {
        name: data.name ?? null,
        repository: {
          url: data.repositoryUrl,
          reference: data.reference ?? null,
          credentials:
            data.useCredentials && data.username && data.password
              ? {
                  username: data.username,
                  password: data.password,
                }
              : null,
        },
      },
    };

    createProject.mutate({ data: payload });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Add a Git repository to create a new project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* Repository URL */}
            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repository.git"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL of the Git repository to clone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Project"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    A custom name for your project. If not provided, we'll use
                    the repository name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Git Reference */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Git Reference (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="main"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    The branch, tag, or commit to checkout. Defaults to the
                    repository's default branch.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Use Credentials Checkbox */}
            <FormField
              control={form.control}
              name="useCredentials"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Use Git Credentials</FormLabel>
                    <FormDescription>
                      Enable this if your repository requires authentication.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Conditional Username and Password fields */}
            {useCredentials && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password or Token</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        For GitHub, use a personal access token.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <StateButton
                type="submit"
                variant={
                  createProject.isPending
                    ? "loading"
                    : createProject.isSuccess
                      ? "success"
                      : createProject.isError
                        ? "error"
                        : "default"
                }
              >
                Create Project
              </StateButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
