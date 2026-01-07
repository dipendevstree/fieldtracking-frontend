import { createFileRoute } from "@tanstack/react-router";
import Analytics from "@/features/calendar/components/Analytics";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/calendar/analytics/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="analytic">
      <Analytics />
    </ProtectedRoute>
  );
}
