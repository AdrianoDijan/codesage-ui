import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};

export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    navigate("/login", { state: { from: location }, replace: true });
  }

  return <>{children}</>;
};
