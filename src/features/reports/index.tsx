import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import ExpanseReport from "./components/expanseReport";
import CustomReports from "./components/custom-reports";
import ReportsHistory from "./components/ReportsHistory";
import { useReportSocketTracker } from "./hooks/useReportSocketTracker";

export type ApprovalsTabValue =
  | "/reports"
  | "/reports/custom-reports"
  | "/reports/reports-history";

export default function Reports() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ApprovalsTabValue);
  };

  // Socket listeners
  useReportSocketTracker();

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList className="grid w-full grid-cols-3 mb-2 h-10">
          <TabsTrigger value="/reports">Expense Reports</TabsTrigger>
          <TabsTrigger value="/reports/custom-reports">
            Custom Reports
          </TabsTrigger>
          <TabsTrigger value="/reports/reports-history">
            Reports History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="/reports" className="space-y-4">
          <ExpanseReport />
        </TabsContent>

        <TabsContent value="/reports/custom-reports" className="space-y-4">
          <CustomReports />
        </TabsContent>

        <TabsContent value="/reports/reports-history" className="space-y-4">
          <ReportsHistory />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
