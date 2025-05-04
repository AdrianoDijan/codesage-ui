import { LoginModal } from "@/components/auth/login-modal";
import { ReactNode, useState, useEffect } from "react";
import { isAuthenticated, useAuthStateListener } from "@/lib/auth/auth-service";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  const checkAuth = () => {
    const isAuth = isAuthenticated();
    setAuthenticated(isAuth);

    if (!isAuth) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoginModalOpen(false);
    }
  };

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, []);

  // Listen for authentication state changes
  useAuthStateListener(checkAuth);

  // While initial check is happening, show nothing
  if (authenticated === null) {
    return null;
  }

  return (
    <>
      {children}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          // Only allow closing if authenticated
          if (isAuthenticated()) {
            setIsLoginModalOpen(false);
          }
        }}
      />
    </>
  );
};
