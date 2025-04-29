import { Navigate } from "react-router";
import { logout } from "@/lib/auth";

export default function Logout() {
  logout();
  return <Navigate to="/login" replace />;
}
