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

const projectFormSchema = z
  .object({
    repositoryUrl: z
      .string()
      .min(1, "Repository URL is required")
      .url("Must be a valid URL"),
    name: z.string().optional(),
    reference: z.string().optional(),
    useCredentials: z.boolean().default(false),
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
    }
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
    defaultValues: {
      repositoryUrl: "",
      name: "",
      reference: "",
      useCredentials: false,
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const createProject = useCreateProject({
    mutation: {
      onSuccess: () => {
        // Invalidate the projects query to refresh the projects list
        queryClient.invalidateQueries({ queryKey: ["/api/users/me/projects"] });

        toast.success("Project created successfully");
        setTimeout(() => {
          setOpen(false);
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      },
      onError: (error) => {
        const axiosError = error;
        const errorMessage = axiosError.response?.data.detail
          ? String(axiosError.response.data.detail)
          : axiosError.message ?? "Failed to create project";
        toast.error(errorMessage);
      },
    },
  });

  // Watch for changes to the useCredentials checkbox to enable/disable validation
  const useCredentials = form.watch("useCredentials");

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (data: ProjectFormData) => {
    const projectRequest = {
      project: {
        repository: {
          url: data.repositoryUrl,
          reference: data.reference || null,
          credentials: data.useCredentials
            ? {
                username: data.username!,
                password: data.password!,
              }
            : null,
        },
        name: data.name || null,
      },
    };

    createProject.mutate({ data: projectRequest });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the repository URL and additional settings to create a new
            project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo.git"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The Git repository URL for your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank to use repository name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch/Reference (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="main" {...field} />
                  </FormControl>
                  <FormDescription>
                    Branch, tag, or commit hash to use (default: main)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel>
                      Use authentication for private repository
                    </FormLabel>
                    <FormDescription>
                      Provide credentials for private repositories
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {useCredentials && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Password/Token</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <StateButton
                type="submit"
                disabled={createProject.isPending}
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
