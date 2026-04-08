// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/use-auth-store";

// Import the actual page components
import OverviewPage from "./overview/components/OverView";
// import LiveTrackingPage from "./Live-Tracking/live-tracking-dashboard";
// import ApprovalsPage from "./Approvals/components/approvals";
import { Navigate } from "@tanstack/react-router";

// Define valid tab values with proper typing
// export type DashboardTabValue =
//   | "/dashboard"
//   | "/dashboard/overview"
//   | "/dashboard/dash-live-tracking"
//   | "/dashboard/approvals";

// // Tab configuration for better maintainability
// const DASHBOARD_TABS = [
//   {
//     value: "/dashboard/overview",
//     label: "Overview",
//     component: OverviewPage,
//   },
//   {
//     value: "/dashboard/dash-live-tracking",
//     label: "Live Tracking",
//     component: LiveTrackingPage,
//   },
//   {
//     value: "/dashboard/approvals",
//     label: "Approvals",
//     component: ApprovalsPage,
//   },
// ] as const;

export default function DashboardPage() {
  const { user } = useAuth();

  // If user is super admin, show super admin dashboard
  if (user?.isSuperAdmin) {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  // Initialize with first tab as default (overview)
  // const [activeTab, setActiveTab] = useState<DashboardTabValue>(
  //   "/dashboard/overview"
  // );

  // const handleTabChange = (value: string) => {
  //   setActiveTab(value as DashboardTabValue);
  // };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList className="grid w-full grid-cols-3 h-10 !mb-2">
          {DASHBOARD_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

       //  Render tab content with mock data 
        <TabsContent value="/dashboard/overview" className="space-y-4">
          <OverviewPage
            salesReps={[]}
            kpis={{
              totalSalesReps: 0,
            }}
          />
        </TabsContent>
        <TabsContent
          value="/dashboard/dash-live-tracking"
          className="space-y-4"
        >
          <LiveTrackingPage />
        </TabsContent>
        <TabsContent value="/dashboard/approvals" className="space-y-4">
          <ApprovalsPage />
        </TabsContent>
      </Tabs> */}
      <OverviewPage
        salesReps={[]}
        kpis={{
          totalSalesReps: 0,
        }}
      />
    </Main>
  );
}
