import ExpenseCategoriesPage from "@/features/settings/Expense-categories";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/settings/expense-categories"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="expense_categories">
      <ExpenseCategoriesPage />
    </ProtectedRoute>
  );
}
