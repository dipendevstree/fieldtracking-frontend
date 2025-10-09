import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";

// Import the actual page components
import ExpenseCategoriesPage from "./Expense-categories";
import LimitsControlsPage from "./Limits-&-Controls";
import ApproversPage from "./Approvers";
import GeneralSettingsPage from "./General";
import Notifications from "./notifications/components/Notifications";

// Define valid tab values with proper typing
export type SettingsTabValue =
  | "/settings"
  | "/settings/expense-categories"
  | "/settings/limits-controls"
  | "/settings/approvers"
  | "/settings/notifications"
  | "/settings/general";

// Tab configuration for better maintainability
const SETTINGS_TABS = [
  {
    value: "/settings/expense-categories",
    label: "Expense Categories",
    component: ExpenseCategoriesPage,
  },
  {
    value: "/settings/limits-controls",
    label: "Limits & Controls",
    component: LimitsControlsPage,
  },
  {
    value: "/settings/approvers",
    label: "Approvers",
    component: ApproversPage,
  },
  {
    value: "/settings/notifications",
    label: "Notifications",
    component: Notifications,
  },
  {
    value: "/settings/general",
    label: "General",
    component: GeneralSettingsPage,
  },
] as const;

// Configurable default tab - change this to set the default tab
const DEFAULT_SETTINGS_TAB: SettingsTabValue = "/settings/expense-categories";

export default function SettingsPage() {
  const { latestLocation } = useRouter();
  const pathname = latestLocation.pathname;

  // Initialize with URL-based default or fallback to configured default
  const [activeTab, setActiveTab] = useState<SettingsTabValue>(
    pathname.includes("/settings/")
      ? (pathname as SettingsTabValue)
      : DEFAULT_SETTINGS_TAB
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as SettingsTabValue);
  };

  return (
    <Main className={cn("flex flex-col")}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList className="grid w-full grid-cols-5 h-10">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SETTINGS_TABS.map((tab) => {
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
