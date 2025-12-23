import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import HolidayCalendarTemplates from "./components/holiday-templates/HolidayTemplates";
import EmployeeTierManagement from "./components/employee-tiers/EmployeeTierManagement";
import LeaveRulesConfiguration from "./components/leave-rules/LeaveRulesConfiguration";
import MyLeaveBalance from "./components/user-view/MyLeaveBalance";
import LeaveTypeManagement from "./components/leave-types/LeaveTypeManagement";

// Tab Config
const LEAVE_Tabs = [
  {
    value: "user-view",
    label: "User View",
    component: MyLeaveBalance,
  },
  {
    value: "leave-types",
    label: "Leave Types",
    component: LeaveTypeManagement,
  },
  {
    value: "employee-tiers",
    label: "Employee Tiers",
    component: EmployeeTierManagement,
  },
  {
    value: "leave-rules",
    label: "Leave Rules",
    component: LeaveRulesConfiguration,
  },
  {
    value: "holiday-templates",
    label: "Holiday Templates",
    component: HolidayCalendarTemplates,
  },
] as const;

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState("user-view");

  return (
    <Main className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground">
          Manage leave polices, holidays, and employee balances.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start h-12 bg-muted/50 p-1">
            {LEAVE_Tabs.map((tab) => {
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

        {LEAVE_Tabs.map((tab) => {
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
