import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import AllReports from "./all-reports";
import CustomReports from "./components/custom-reports";

export type ApprovalsTabValue = "/reports" | "/reports/custom-reports";

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
        <TabsList className="grid w-full grid-cols-2 mb-2 h-10">
          <TabsTrigger value="/reports">Expense Reports</TabsTrigger>
          <TabsTrigger value="/reports/custom-reports">
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="/reports" className="space-y-4">
          <AllReports />
        </TabsContent>

        <TabsContent value="/reports/custom-reports" className="space-y-4">
          <CustomReports />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
