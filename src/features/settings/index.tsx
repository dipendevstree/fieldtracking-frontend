import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

// Page Components
import ExpenseCategoriesPage from "./Expense-categories";

import Notifications from "./notifications/components/Notifications";
import GeneralApplicationSettings from "./General";
import { ApproverFormNew } from "./Approvers/components/Approvers-new";
import { useUnsavedChangesStore } from "./store/use-unsaved-changes-store";
import LeaveTypeManagement from "../leave-management/components/leave-types/LeaveTypeManagement";
import HolidayTypeManagement from "../holiday-management/components/holiday-types/HolidayTypeManagement";

// Tab Config
const SETTINGS_TABS = [
  {
    value: "/settings/expense-categories",
    label: "Expense Categories",
    component: ExpenseCategoriesPage,
  },
  // {
  //   value: "/settings/limits-controls",
  //   label: "Limits & Controls",
  //   component: LimitsControlsPage,
  // },
  {
    value: "/settings/leave-type",
    label: "Leave Types",
    component: LeaveTypeManagement,
  },
  {
    value: "/settings/holiday-type",
    label: "Holiday Types",
    component: HolidayTypeManagement,
  },
  {
    value: "/settings/approvers",
    label: "Approvers",
    component: ApproverFormNew,
  },
  {
    value: "/settings/notifications",
    label: "Notifications",
    component: Notifications,
  },
  {
    value: "/settings/general-settings",
    label: "General",
    component: GeneralApplicationSettings,
  },
] as const;

// Configurable default tab - change this to set the default tab
const DEFAULT_SETTINGS_TAB = "/settings/expense-categories";

export default function SettingsPage() {
  const { latestLocation } = useRouter();

  // 1. Tab State
  const [activeTab, setActiveTab] = useState(
    latestLocation.pathname.includes("/settings/")
      ? latestLocation.pathname
      : DEFAULT_SETTINGS_TAB
  );

  // Track intended tab destination
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  // 2. Global Dirty State (Zustand)
  const isDirty = useUnsavedChangesStore((state) => state.isDirty);
  const { reset } = useUnsavedChangesStore((state) => state.actions);

  // 3. Navigation Blockers
  // A. Route Blocker (Browser/Sidebar)
  const { showExitPrompt, confirmExit, cancelExit } =
    useUnsavedChanges(isDirty);

  // B. Tab Blocker
  const handleTabChange = (newValue: string) => {
    if (activeTab === newValue) return;

    if (isDirty) {
      setPendingTab(newValue); // Trigger Dialog
    } else {
      setActiveTab(newValue);
    }
  };

  // 4. Unified Dialog Handlers
  const isDialogOpen = showExitPrompt || !!pendingTab;

  const handleConfirm = () => {
    if (showExitPrompt) {
      // User is leaving the route
      confirmExit();
    } else if (pendingTab) {
      // User is switching tabs
      reset(); // Reset dirty state
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleCancel = (isOpen: boolean) => {
    if (!isOpen) {
      if (showExitPrompt) cancelExit(); // Stay on route
      setPendingTab(null); // Stay on tab
    }
  };

  return (
    <Main className="flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList
          className={`grid w-full grid-cols-${SETTINGS_TABS.length || 1} h-10`}
        >
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
              forceMount={false as any}
            >
              {activeTab === tab.value && <Component />}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* --- Single Common Dialog --- */}
      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={handleCancel}
        handleConfirm={handleConfirm}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
      />
    </Main>
  );
}
