import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./providers/AuthProvider";

export function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
