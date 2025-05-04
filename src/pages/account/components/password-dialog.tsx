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
} from "@/components/ui/form";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import StateButton from "../../../components/state-button";
import { useUpdateUserInfo } from "@/api/endpoints/users/users.gen";
import { getErrorMessage } from "@/lib/error";

const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((obj) => obj.new_password === obj.confirm_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((obj) => obj.new_password !== obj.current_password, {
    message: "New password must be different from current password",
  });

export type PasswordFormData = z.infer<typeof passwordFormSchema>;

interface PasswordChangeDialogProps {
  trigger: React.ReactNode;
}

export function PasswordChangeDialog({ trigger }: PasswordChangeDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const changePassword = useUpdateUserInfo({
    mutation: {
      onSuccess: () => {
        toast.success("Password changed successfully");
        setTimeout(() => {
          changePassword.reset();
          setOpen(false);
          form.reset();
        }, 2000);
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setTimeout(() => {
          changePassword.reset();
        }, 2000);
      },
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

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
            onSubmit={form.handleSubmit((data) => {
              void changePassword.mutateAsync({
                userId: "me",
                data: {
                  user: {
                    password: {
                      current_password: data.current_password,
                      new_password: data.new_password,
                    },
                  },
                },
              });
            })}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="current_password"
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
              name="new_password"
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
              name="confirm_password"
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
              <StateButton
                type="submit"
                disabled={changePassword.isPending}
                variant={
                  changePassword.isPending
                    ? "loading"
                    : changePassword.isSuccess
                      ? "success"
                      : changePassword.isError
                        ? "error"
                        : "default"
                }
              >
                Save
              </StateButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
