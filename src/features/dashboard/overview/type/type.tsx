export interface DashboardKPI {
  totalSalesReps: number;
  activeInField: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalCustomers: number;
  totalVisits: number;
  averageSessionDuration: number;
  conversionRate: number;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  status: "active" | "idle" | "offline" | "on_break";
  location: string;
  lastSeen: string;
  todayVisits: number;
  todayRevenue: number;
  avatar?: string;
  role: string;
  territory?: string;
  phone?: string;
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp: string;
  };
  activityStatus: "working" | "traveling" | "at_customer" | "break" | "offline";
  createdAt?: string;
  updatedAt?: string;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: ["visit", "sale", "checkin", "status_change", "location_update"];
  metadata?: {
    customerId?: string;
    customerName?: string;
    amount?: number;
    location?: string;
    [key: string]: string | number | boolean | undefined;
  };
  createdAt?: string;
}

export interface DashboardStats {
  kpis: DashboardKPI;
  salesReps: SalesRep[];
  recentActivities: RecentActivity[];
  topPerformers: SalesRep[];
  pendingApprovals: string[];
  alerts: string[];
}

export interface OverviewFilter {
  status?: "active" | "idle" | "offline" | "on_break";
  roleId?: string;
  territoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchFor?: string;
}
