import ExpenseApprovalsPage from "@/features/approvals";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/approvals/expense-category"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="expense_category">
      <ExpenseApprovalsPage />
    </ProtectedRoute>
  );
}
