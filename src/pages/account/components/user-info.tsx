import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import StateButton from "@/components/state-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useGetUserInfo } from "@/api/endpoints/users/users.gen";
import { useUpdateUserInfo } from "@/api/endpoints/users/users.gen";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  first_name: z.string().nonempty(),
  last_name: z.string().nonempty(),
  email: z.string().email(),
});

type FormData = z.infer<typeof formSchema>;

export function UserInfoCard() {
  const queryClient = useQueryClient();
  const user = useGetUserInfo("me");

  const updateUser = useUpdateUserInfo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      },
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user.data?.data.first_name ?? "",
      last_name: user.data?.data.last_name ?? "",
      email: user.data?.data.email ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user.data) {
      form.reset({
        first_name: user.data.data.first_name ?? "",
        last_name: user.data.data.last_name ?? "",
        email: user.data.data.email,
      });
    }
  }, [user.data, form]);

  return user.isLoading ? (
    <PersonalInfoCardSkeleton />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              updateUser.mutateAsync({ userId: "me", data });
            })}
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={user.data?.data.username ?? ""}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <StateButton
                type="submit"
                disabled={updateUser.isPending}
                variant={
                  updateUser.isPending
                    ? "loading"
                    : updateUser.isSuccess
                    ? "success"
                    : updateUser.isError
                    ? "error"
                    : "default"
                }
              >
                Save
              </StateButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function PersonalInfoCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-7 w-44" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="mt-6 flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
