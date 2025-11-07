import { createFileRoute } from "@tanstack/react-router";
import CalendarPage from "@/features/calendar";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/calendar/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="analytic">
      <CalendarPage />
    </ProtectedRoute>
  );
}
