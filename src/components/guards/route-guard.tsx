import React from "react";

import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/use-auth-store";
import { UserRole } from "../layout/types";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredResource?: string;
  requiredAction?: string;
  requiredRole?: string;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export function RouteGuard({
  children,
  requiredResource,
  requiredRole,
  requiredRoles,
  fallbackPath = "/403",
}: RouteGuardProps) {
  const { user, hasPermission, hasRole, hasAnyRole, isLoading } =
    useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  // Check single role
  if (requiredRole) {
    const hasRequiredRole = hasRole(requiredRole as UserRole);

    if (!hasRequiredRole) {
      return <Navigate to={fallbackPath} />;
    }
  }

  // Check multiple roles (user needs ANY of them)
  if (requiredRoles) {
    const hasAnyRequiredRole = hasAnyRole(requiredRoles as UserRole[]);

    if (!hasAnyRequiredRole) {
      return <Navigate to={fallbackPath} />;
    }
  }

  // Check permission-based access
  if (requiredResource) {
    const hasRequiredPermission = hasPermission(requiredResource);

    if (!hasRequiredPermission) {
      return <Navigate to={fallbackPath} />;
    }
  }

  return <>{children}</>;
}
