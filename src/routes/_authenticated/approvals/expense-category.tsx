import ExpenseApprovalsPage from "@/features/approvals";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/approvals/expense-category"
)({
  component: ExpenseApprovalsPage,
});
