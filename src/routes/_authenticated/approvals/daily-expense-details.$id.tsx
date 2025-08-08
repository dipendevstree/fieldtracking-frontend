import { createFileRoute } from "@tanstack/react-router";
import DailyExpenseDetails from "@/features/approvals/components/daily-expanse/components/daily-expense-details";

export const Route = createFileRoute(
  "/_authenticated/approvals/daily-expense-details/$id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <DailyExpenseDetails />;
}
