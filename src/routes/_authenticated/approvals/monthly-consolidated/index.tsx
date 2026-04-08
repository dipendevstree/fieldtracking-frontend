import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import MonthlyExpenses from "@/features/approvals/components/monthly-expanse/monthly-expenses";

export const Route = createFileRoute(
  "/_authenticated/approvals/monthly-consolidated/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="monthly_consolidated">
      <MonthlyExpenses />
    </ProtectedRoute>
  );
}
