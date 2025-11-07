import { createFileRoute } from "@tanstack/react-router";
import ExpenseApprovalsPage from "@/features/approvals";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute(
  "/_authenticated/approvals/reports-analytics"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="reports_analytics">
      <ExpenseApprovalsPage />
    </ProtectedRoute>
  );
}
