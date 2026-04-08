import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import ReportsAnalytics from "@/features/approvals/components/Reports-&-Analytics/reports-&-analytics";

export const Route = createFileRoute(
  "/_authenticated/approvals/reports-analytics/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="reports_analytics">
      <ReportsAnalytics />
    </ProtectedRoute>
  );
}
