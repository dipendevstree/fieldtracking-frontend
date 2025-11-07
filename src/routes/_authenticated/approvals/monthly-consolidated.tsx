import { createFileRoute } from "@tanstack/react-router";
import ExpenseApprovalsPage from "@/features/approvals";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute(
  "/_authenticated/approvals/monthly-consolidated"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="monthly_consolidated">
      <ExpenseApprovalsPage />
    </ProtectedRoute>
  );
}
