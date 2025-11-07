import { useState, useEffect, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import DailyExpenses from "./components/daily-expanse/daily-expenses";
import MonthlyExpenses from "./components/monthly-expanse/monthly-expenses";
import ReportsAnalytics from "./components/Reports-&-Analytics/reports-&-analytics";
import { usePermission } from "@/permissions/hooks/use-permission";

export type ApprovalsTabValue =
  | "/approvals/daily-expense"
  | "/approvals/monthly-consolidated"
  | "/approvals/reports-analytics"
  | "/approvals/expense-category";

const TAB_DEFINITIONS = [
  {
    key: "daily_expense",
    value: "/approvals",
    label: "Daily Expenses",
    content: <DailyExpenses />,
  },
  {
    key: "monthly_consolidated",
    value: "/approvals/monthly-consolidated",
    label: "Monthly Consolidated",
    content: <MonthlyExpenses />,
  },
  {
    key: "reports_analytics",
    value: "/approvals/reports-analytics",
    label: "Reports & Analytics",
    content: <ReportsAnalytics />,
  },
];

export default function ExpenseApprovalsPage() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);

  const { hasAccess } = usePermission();

  const visibleTabs = useMemo(
    () => TAB_DEFINITIONS.filter((t) => hasAccess(t.key)),
    [hasAccess]
  );

  const visibleTabCount = visibleTabs.length || 1;

  useEffect(() => {
    if (visibleTabs.length === 0) return;
    const found = visibleTabs.find((t) => t.value === activeTab);
    if (!found) setActiveTab(visibleTabs[0].value);
  }, [visibleTabs, activeTab]);

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
        {visibleTabs.length <= 1 ? (
          visibleTabs[0] ? (
            <div className="space-y-4">{visibleTabs[0].content}</div>
          ) : null
        ) : (
          <>
            <TabsList
              className={cn(
                "grid w-full mb-2 h-10",
                `grid-cols-${visibleTabCount}`
              )}
            >
              {visibleTabs.map((t) => (
                <TabsTrigger key={t.key} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {visibleTabs.map((t) => (
              <TabsContent key={t.key} value={t.value} className="space-y-4">
                {t.content}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </Main>
  );
}
