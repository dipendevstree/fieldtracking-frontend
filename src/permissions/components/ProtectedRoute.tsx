import React from "react";
import { Navigate } from "@tanstack/react-router";
import { usePermission } from "../hooks/use-permission";
import ForbiddenError from "@/features/errors/forbidden";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallback = <ForbiddenError />,
}: ProtectedRouteProps) {
  const { user, hasAccess, isAuthenticated } = usePermission();

  if (!isAuthenticated) {
    const wasSuperAdmin = localStorage.getItem("was_super_admin") === "true";
    return <Navigate to={wasSuperAdmin ? "/superadmin-sign-in" : "/sign-in"} replace />;
  }
  const isSuperAdmin = user?.isSuperAdmin;

  if (requiredPermission && !hasAccess(requiredPermission) && !isSuperAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
