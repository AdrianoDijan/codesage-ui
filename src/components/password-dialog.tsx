import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useUpdateUserProfile } from "@/hooks/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { UserUpdate } from "@/api/models";
import { Loader2 } from "lucide-react";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((obj) => obj.newPassword === obj.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;

interface PasswordChangeDialogProps {
  trigger: React.ReactNode;
  handleSubmit: (data: PasswordFormData) => void;
}

export function PasswordChangeDialog({
  trigger,
  handleSubmit: onSubmit,
}: PasswordChangeDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    isPending,
    isSuccess,
    wasExecuted,
    isError,
    error,
    resetMutation,
  } = useUpdateUserProfile();

  const onFormSubmit = async (data: PasswordFormData) => {
    try {
      // Create a password update object
      const passwordUpdate: UserUpdate = {
        password: {
          current_password: data.currentPassword,
          new_password: data.newPassword,
        },
      };

      await handleSubmit(passwordUpdate);

      toast.success("Password changed successfully");
      form.reset();
      // Keep dialog open for 1.5 seconds to show success state before closing
      setTimeout(() => {
        setOpen(false);
      }, 1500);

      if (onSubmit) {
        onSubmit(data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.detail || err.message
          : "Failed to change password";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isError && wasExecuted) {
      const errorMessage = error
        ? error.response?.data?.detail || error.message
        : "Failed to change password";
      toast.error(errorMessage as string);
      setTimeout(() => {
        resetMutation();
      }, 2000);
    }
  }, [isError, wasExecuted, error, resetMutation]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your
            credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className={`${
                  isPending
                    ? "bg-primary animate-pulse"
                    : isSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : isError
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : isSuccess ? (
                  "Success"
                ) : isError ? (
                  "Error"
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
