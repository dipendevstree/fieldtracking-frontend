import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import AllReports from "./all-reports";
import PerformanceReport from "./performance-reports";

export type ApprovalsTabValue =
  | "/reports"
  | "/reports/performance"
  | "/reports/field-activity"
  | "/reports/customer-reports"
  | "/reports/report-history";

export default function Reports() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;
  const [activeTab, setActiveTab] = useState<string>(pathname);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ApprovalsTabValue);
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-4 space-y-5"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="/reports">Expense Reports</TabsTrigger>
          <TabsTrigger value="/reports/performance">Performance Reports</TabsTrigger>
          <TabsTrigger value="/reports/field-activity">
            Field Activity
          </TabsTrigger>
          <TabsTrigger value="/reports/customer-reports">
            Customer Reports
          </TabsTrigger>
          <TabsTrigger value="/reports/report-history">
            Report History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="/reports" className="space-y-4">
          <AllReports />
        </TabsContent>
        <TabsContent value="/reports/performance" className="space-y-4">
          <PerformanceReport />
        </TabsContent>
        <TabsContent value="/reports/field-activity" className="space-y-4">
          field-activity
        </TabsContent>
        <TabsContent value="/reports/customer-reports" className="space-y-4">
          customer-reports
        </TabsContent>
        <TabsContent value="/reports/report-history" className="space-y-4">
          report-history
        </TabsContent>
      </Tabs>
    </Main>
  );
}
