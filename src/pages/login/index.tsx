import { useNavigate } from "react-router";
import { LoginForm } from "./components/login-form";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSuccessfulLogin={() => {
            void navigate("/");
          }}
        />
      </div>
      <Toaster />
    </div>
  );
}
