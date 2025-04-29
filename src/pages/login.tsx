import { LoginForm, LoginFormSchema } from "@/components/login-form";
import { useLogin } from "@/api/endpoints/authentication/authentication.gen";
import { z } from "zod";

export default function Page() {
  const loginMutation = useLogin();

  const handleLogin = async (data: z.infer<typeof LoginFormSchema>) => {
    await loginMutation
      .mutateAsync({
        data: {
          grant_type: "password",
          username: data.username,
          password: data.password,
        },
      })
      .then((data) => {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", data.data.access_token);
        localStorage.setItem("refreshToken", data.data.refresh_token);
      })
      .catch((error) => {
        console.error(error);
      });
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm handleSubmit={handleLogin} />
      </div>
    </div>
  );
}
