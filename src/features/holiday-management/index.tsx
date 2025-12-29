import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import HolidayCalendarTemplates from "./components/holiday-templates/HolidayTemplates";
import HolidayManagement from "./components/holiday/HolidayManagement";
import HolidayTypeManagement from "./components/holiday-types/HolidayTypeManagement";

// Tab Config
const HOLIDAY_Tabs = [
  {
    value: "holiday-calendar",
    label: "Holiday Calendar",
    component: HolidayManagement,
  },
  {
    value: "holiday-types",
    label: "Holiday Types",
    component: HolidayTypeManagement,
  },
  {
    value: "holiday-templates",
    label: "Holiday Templates",
    component: HolidayCalendarTemplates,
  },
] as const;

export default function HolidayManagementPage() {
  const [activeTab, setActiveTab] = useState("holiday-calendar");

  return (
    <Main className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Holiday Management
        </h1>
        <p className="text-muted-foreground">
          Manage holidays and holiday templates.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start h-12 bg-muted/50 p-1">
            {HOLIDAY_Tabs.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {HOLIDAY_Tabs.map((tab) => {
          const Component = tab.component;
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-4"
            >
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </Main>
  );
}
