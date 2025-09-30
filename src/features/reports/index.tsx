import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import AllReports from "./all-reports";
import CustomerReports from "./components/customer-reports";
import FieldActivityReports from "./components/field-activity";
import ReportHistory from "./components/report-history";
import PerformanceDashboard from "./components/performance";

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
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList className="grid w-full grid-cols-5 mb-2 h-10">
          <TabsTrigger value="/reports">Expense Reports</TabsTrigger>
          <TabsTrigger value="/reports/performance">Performance</TabsTrigger>
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
          <PerformanceDashboard />
        </TabsContent>
        <TabsContent value="/reports/field-activity" className="space-y-4">
          <FieldActivityReports />
        </TabsContent>
        <TabsContent value="/reports/customer-reports" className="space-y-4">
          <CustomerReports />
        </TabsContent>
        <TabsContent value="/reports/report-history" className="space-y-4">
          <ReportHistory />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
