import { createFileRoute } from "@tanstack/react-router";
import ExpenseApprovalsPage from "@/features/approvals";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/approvals/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="approvals">
      <ExpenseApprovalsPage />
    </ProtectedRoute>
  );
}
