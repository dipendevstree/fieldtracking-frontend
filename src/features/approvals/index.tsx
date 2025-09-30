import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";

import CategoryExpanses from "./components/category/expenses-category";
import DailyExpenses from "./components/daily-expanse/daily-expenses";
import MonthlyExpenses from "./components/monthly-expanse/monthly-expenses";
import ReportsAnalytics from "./components/Reports-&-Analytics/reports-&-analytics";

export type ApprovalsTabValue =
  | "/approvals/daily-expense"
  | "/approvals/monthly-consolidated"
  | "/approvals/reports-analytics"
  | "/approvals/expense-category";

export default function ExpenseApprovalsPage() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ApprovalsTabValue);
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList className="grid w-full grid-cols-3 mb-2 h-10">
          <TabsTrigger value="/approvals">Daily Expenses</TabsTrigger>
          <TabsTrigger value="/approvals/monthly-consolidated">
            Monthly Consolidated
          </TabsTrigger>
          <TabsTrigger value="/approvals/reports-analytics">
            Reports & Analytics
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
        <TabsContent value="/approvals/expense-category" className="space-y-4">
          <CategoryExpanses />
        </TabsContent>
        <TabsContent value="/approvals/reports-analytics" className="space-y-4">
          <ReportsAnalytics />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
