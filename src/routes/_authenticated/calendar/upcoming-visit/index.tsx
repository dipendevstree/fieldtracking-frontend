import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import UpcomingVisits from "@/features/calendar/components/UpcomingVisits";

export const Route = createFileRoute(
  "/_authenticated/calendar/upcoming-visit/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="upcoming_visits">
      <UpcomingVisits />
    </ProtectedRoute>
  );
}
