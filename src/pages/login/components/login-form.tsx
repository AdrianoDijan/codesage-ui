import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StateButton from "@/components/state-button";
import { useNavigate } from "react-router";
import { useLogin } from "@/api/endpoints/authentication/authentication.gen";
import { toast } from "sonner";
import { storeTokens } from "@/lib/auth/auth-service";
import { getErrorMessage as getErrorMessage } from "@/lib/error";

export const LoginFormSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().min(8),
  grant_type: z.literal("password").optional().default("password"),
});

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSuccessfulLogin?: () => void;
}

export function LoginForm({
  className,
  onSuccessfulLogin,
  ...props
}: LoginFormProps) {
  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const navigate = useNavigate();
  const login = useLogin({
    mutation: {
      onSuccess: (data) => {
        storeTokens(data.data.access_token, data.data.refresh_token);
        toast.success("Login successful");

        if (onSuccessfulLogin) {
          onSuccessfulLogin();
        } else {
          void navigate(0);
        }
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error);

        toast.error(errorMessage);
        login.reset();
      },
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit((data) => {
              void login.mutateAsync({ data: data });
            })(e);
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="w-full flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                CS
              </div>
              <h1 className="text-lg font-bold">CodeSage</h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <StateButton
                type="submit"
                disabled={login.isPending}
                className="w-full"
                variant={
                  login.isPending
                    ? "loading"
                    : login.isSuccess
                      ? "success"
                      : login.isError
                        ? "error"
                        : "default"
                }
              >
                Login
              </StateButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
