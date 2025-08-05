import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";
import { Users, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Import the actual page components
import OverviewPage from "./overview/components/OverView";
import LiveTrackingPage from "./Live-Tracking/components/LiveTracking";
import ApprovalsPage from "./Approvals/components/approvals";

// Define valid tab values with proper typing
export type DashboardTabValue =
  | "/dashboard"
  | "/dashboard/overview"
  | "/dashboard/live-tracking"
  | "/dashboard/approvals";

// Tab configuration for better maintainability
const DASHBOARD_TABS = [
  {
    value: "/dashboard/overview",
    label: "Overview",
    component: OverviewPage,
  },
  {
    value: "/dashboard/live-tracking",
    label: "Live Tracking",
    component: LiveTrackingPage,
  },
  {
    value: "/dashboard/approvals",
    label: "Approvals",
    component: ApprovalsPage,
  },
] as const;

// Mock data for Overview
const overviewMock = {
  salesReps: [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "active" as const,
      location: "New York",
      lastSeen: "2024-06-01 10:00",
      todayVisits: 5,
      todayRevenue: 1200,
      avatar: "",
      role: "Sales Rep",
      territory: "East",
      phone: "123-456-7890",
      isOnline: true,
      currentLocation: {
        lat: 40.7128,
        lng: -74.006,
        accuracy: 10,
        timestamp: "2024-06-01T10:00:00Z",
      },
      activityStatus: "working" as const,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      status: "idle" as const,
      location: "Los Angeles",
      lastSeen: "2024-06-01 09:30",
      todayVisits: 3,
      todayRevenue: 800,
      avatar: "",
      role: "Sales Rep",
      territory: "West",
      phone: "123-456-7891",
      isOnline: true,
      currentLocation: {
        lat: 34.0522,
        lng: -118.2437,
        accuracy: 15,
        timestamp: "2024-06-01T09:30:00Z",
      },
      activityStatus: "traveling" as const,
      createdAt: "",
      updatedAt: "",
    },
  ],
  kpis: {
    totalSalesReps: 12,
    activeInField: 8,
    totalRevenue: 25000,
    monthlyGrowth: 15,
    totalCustomers: 150,
    totalVisits: 45,
    averageSessionDuration: 120,
    conversionRate: 0.25,
  },
};

// Mock data for Live Tracking
const liveTrackingMock = {
  users: [
    {
      userId: "1",
      firstName: "Alice",
      lastName: "Johnson",
      fullName: "Alice Johnson",
      email: "alice@example.com",
      phone: "123-456-7890",
      roleId: "1",
      roleName: "Sales Representative",
      territoryId: "1",
      territoryName: "East Territory",
      isOnline: true,
      lastSeen: "2024-06-01T10:00:00Z",
      currentLocation: {
        lat: 40.7128,
        lng: -74.006,
        accuracy: 10,
        timestamp: "2024-06-01T10:00:00Z",
      },
      status: "active" as const,
      activityStatus: "working" as const,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-06-01T10:00:00Z",
    },
    {
      userId: "2",
      firstName: "Bob",
      lastName: "Smith",
      fullName: "Bob Smith",
      email: "bob@example.com",
      phone: "123-456-7891",
      roleId: "1",
      roleName: "Sales Representative",
      territoryId: "2",
      territoryName: "West Territory",
      isOnline: true,
      lastSeen: "2024-06-01T09:30:00Z",
      currentLocation: {
        lat: 34.0522,
        lng: -118.2437,
        accuracy: 15,
        timestamp: "2024-06-01T09:30:00Z",
      },
      status: "idle" as const,
      activityStatus: "traveling" as const,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-06-01T09:30:00Z",
    },
  ],
};

// Mock data for Approvals
const approvalsMock = [
  {
    approvalId: "1",
    type: "expense" as const,
    employeeId: "1",
    employeeName: "Alice Johnson",
    amount: 150.0,
    currency: "USD",
    description: "Travel expenses for client meeting",
    submittedDate: "2024-06-01T08:00:00Z",
    status: "pending" as const,
    priority: "medium" as const,
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-06-01T08:00:00Z",
  },
  {
    approvalId: "2",
    type: "allowance" as const,
    employeeId: "2",
    employeeName: "Bob Smith",
    amount: 75.5,
    currency: "USD",
    description: "Meal allowance for field visit",
    submittedDate: "2024-06-01T09:00:00Z",
    status: "pending" as const,
    priority: "low" as const,
    createdAt: "2024-06-01T09:00:00Z",
    updatedAt: "2024-06-01T09:00:00Z",
  },
];

export default function DashboardPage() {
  // Initialize with first tab as default (overview)
  const [activeTab, setActiveTab] = useState<DashboardTabValue>(
    "/dashboard/overview"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as DashboardTabValue);
  };

  const handleExportReport = () => {
    // TODO: Implement report export functionality
    // console.log('Exporting dashboard report...')
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Field Sales Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor your field sales team performance and activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button asChild>
            <Link to="/user-management">
              <Users className="h-4 w-4 mr-2" />
              Add Sales Rep
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-4 space-y-5"
      >
        <TabsList className="grid w-full grid-cols-3">
          {DASHBOARD_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Render tab content with mock data */}
        <TabsContent value="/dashboard/overview" className="space-y-4">
          <OverviewPage
            salesReps={overviewMock.salesReps}
            kpis={overviewMock.kpis}
          />
        </TabsContent>
        <TabsContent value="/dashboard/live-tracking" className="space-y-4">
          <LiveTrackingPage users={liveTrackingMock.users} />
        </TabsContent>
        <TabsContent value="/dashboard/approvals" className="space-y-4">
          <ApprovalsPage approvals={approvalsMock} />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
