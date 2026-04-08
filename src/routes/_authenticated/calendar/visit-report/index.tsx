import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import VisitReports from "@/features/calendar/components/VisitReports";

export const Route = createFileRoute("/_authenticated/calendar/visit-report/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="visits_reports">
      <VisitReports />
    </ProtectedRoute>
  );
}
