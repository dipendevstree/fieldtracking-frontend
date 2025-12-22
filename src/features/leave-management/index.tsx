import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import HolidayCalendarTemplates from "./components/holiday-templetes/HolidayCalendarTemplates";
import EmployeeTierManagement from "./components/employee-tiers/EmployeeTierManagement";
import LeaveRulesConfiguration from "./components/leave-rules/LeaveRulesConfiguration";
import MyLeaveBalance from "./components/user-view/MyLeaveBalance";
import {
  Users,
  Calendar,
  Layers,
  ShieldCheck,
  CalendarRange,
} from "lucide-react";
import LeaveTypeManagement from "./components/leave-types/LeaveTypeManagement";

// Tab Config
const LEAVE_Tabs = [
  {
    value: "user-view",
    label: "User View",
    component: MyLeaveBalance,
    icon: Users,
  },
  {
    value: "leave-types",
    label: "Leave Types",
    component: LeaveTypeManagement,
    icon: Layers,
  },
  {
    value: "employee-tiers",
    label: "Employee Tiers",
    component: EmployeeTierManagement,
    icon: ShieldCheck,
  },
  {
    value: "leave-rules",
    label: "Leave Rules",
    component: LeaveRulesConfiguration,
    icon: CalendarRange,
  },
  {
    value: "holiday-templates",
    label: "Holiday Templates",
    component: HolidayCalendarTemplates,
    icon: Calendar,
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
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
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
