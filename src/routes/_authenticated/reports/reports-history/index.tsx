import ReportsHistory from "@/features/reports/components/ReportsHistory";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/reports/reports-history/"
)({
  component: () => (
    <ProtectedRoute requiredPermission="reports">
      <ReportsHistory />
    </ProtectedRoute>
  ),
});
