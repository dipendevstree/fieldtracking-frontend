import DashboardPage from "@/features/dashboard";
import { usePermission } from "@/permissions/hooks/use-permission";
import { useFirstAccessibleRoute } from "@/permissions/hooks/use-first-accessible-route";
import { createFileRoute, Navigate } from "@tanstack/react-router";

function AuthenticatedIndex() {
  const { hasAccess, user } = usePermission();
  const firstAccessibleRoute = useFirstAccessibleRoute();

  const isSuperAdmin = user?.isSuperAdmin;

  const hasDashboardAccess = isSuperAdmin || hasAccess("dashboard");

  // If user has dashboard permission, show the dashboard
  if (hasDashboardAccess) {
    return <DashboardPage />;
  }

  // Otherwise, redirect to the first route they can access
  return <Navigate to={firstAccessibleRoute} replace />;
}

export const Route = createFileRoute("/_authenticated/")({
  component: AuthenticatedIndex,
});
