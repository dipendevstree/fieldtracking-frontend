import { createFileRoute, Navigate } from "@tanstack/react-router";
import DailyExpenseDetails from "@/features/approvals/components/daily-expanse/components/daily-expense-details";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export const Route = createFileRoute(
  "/_authenticated/approvals/daily-expense-details/$id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PermissionGate
      requiredPermission="daily_expense"
      action="edit"
      fallback={<Navigate to="/403" replace />}
    >
      <DailyExpenseDetails />
    </PermissionGate>
  );
}
