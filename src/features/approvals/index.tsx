import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import DailyExpenses from "./components/daily-expanse/daily-expenses";

export default function ExpenseApprovalsPage() {
  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <DailyExpenses />
    </Main>
  );
}
