import ExpenseCategory from "@/features/approvals/components/category/expenses-category";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/approvals/expense-category"
)({
  component: ExpenseCategory,
});
