import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import DailyExpenses from "./components/daily-expenses";
import MonthlyExpenses from "./components/monthly-expenses";
import CategoryExpanses from "./components/category/expenses-category";

// Components for each tab
// import DailyExpenses from './components/DailyExpenses'
// import MonthlyConsolidated from './components/MonthlyConsolidated'
// import ReportsAnalytics from './components/ReportsAnalytics'
export type ApprovalsTabValue =
  | "/approvals/daily-expense"
  | "/approvals/monthly-consolidated"
  | "/approvals/reports-analytics";

export default function ExpenseApprovalsPage() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ApprovalsTabValue);
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Expense Approvals</h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-4 space-y-5"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="/approvals">Daily Expenses</TabsTrigger>
          <TabsTrigger value="/approvals/monthly-consolidated">
            Monthly Consolidated
          </TabsTrigger>
          <TabsTrigger value="/approvals/reports-analytics">
            Reports & Analytics
          </TabsTrigger>
          <TabsTrigger value="/approvals/category-expenses">
            Category Expenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="/approvals" className="space-y-4">
          <DailyExpenses />
        </TabsContent>
        <TabsContent
          value="/approvals/monthly-consolidated"
          className="space-y-4"
        >
          <MonthlyExpenses />
        </TabsContent>
        <TabsContent value="/approvals/category-expenses" className="space-y-4">
          <CategoryExpanses />
        </TabsContent>
        {/* <TabsContent value='/approvals/reports-analytics' className='space-y-4'>
          <ReportsAnalytics />
        </TabsContent>  */}
      </Tabs>
    </Main>
  );
}
