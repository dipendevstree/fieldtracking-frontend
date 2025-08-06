import {
  AppWindow,
  Building2,
  Calendar,
  ChartColumn,
  Home,
  MapPin,
  Shield,
  ShieldUser,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "John Doe",
    email: "jane@example.com",
    role: "Admin",
    avatar: "/avatars/jane.png",
  },
  teams: [
    {
      name: "FieldFieldTrack360",
      logo: Building2,
      plan: "Enterprise",
    },
  ],
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
          menuKey: "dashboard",
        },
        {
          title: "Live tracking",
          url: "/livetracking",
          icon: MapPin,
          menuKey: "live_tracking",
        },
        {
          title: "Customers",
          // url: '/customers',
          icon: Building2,
          items: [
            {
              title: "Customer Directory",
              url: "/customers",
            },

            {
              title: "Add Customer",
              url: "/customers/add-customer",
            },
            // {
            //   title: 'Customer Analytics',
            //   url: '/customers/analytics',
            // },
            // {
            //   title: 'Import History',
            //   url: '/customers/imports',
            // },
            {
              title: "Customer Type",
              url: "/customer-type",
            },
          ],
        },

        {
          title: "User Management",
          icon: ShieldUser,
          menuKey: "User_Management",
          items: [
            {
              title: "Add User",
              url: "/user-management",
              menuKey: "all_users",
            },
            {
              title: "Roles & Permissions",
              url: "/user-management/roles",
              menuKey: "roles_permission",
            },
            {
              title: "User Territory",
              url: "/user-territory",
              menuKey: "user_territory",
            },
          ],
        },
        {
          title: "Calendar",
          icon: Calendar,
          menuKey: "calendar",
          items: [
            {
              title: "Calendar View",
              url: "/calendar",
              menuKey: "calender_view",
            },
            {
              title: "Upcoming Visits",
              url: "/calendar/upcoming-visit",
              menuKey: "upcoming_visits",
            },
            {
              title: "Visit Reports",
              url: "/calendar/visit-report",
              menuKey: "visits_reports",
            },
            {
              title: "Task Assignment",
              url: "/calendar/task-assignment",
              menuKey: "task_assignment",
            },
            {
              title: "Analytics",
              url: "/calendar/analytics",
              menuKey: "analytic",
            },
          ],
        },
        {
          title: "Approvals",
          icon: AppWindow,
          menuKey: "approvals",
          items: [
            {
              title: "Daily Expense",
              url: "/approvals",
              menuKey: "daily_expense",
            },
            {
              title: "Monthly Consolidated",
              url: "/approvals/monthly-consolidated",
              menuKey: "monthly_consolidated",
            },
            {
              title: "Reports & Analytics",
              url: "/",
              menuKey: "reports_analytics",
            },
            {
              title: "Category Expenses",
              url: "/approvals/expense-category",
              menuKey: "expense_category",
            },
          ],
        },
        {
          title: "Reports",
          icon: ChartColumn,
          menuKey: "reports",
          items: [
            {
              title: "All Reports",
              url: "/reports",
              menuKey: "all_reports",
            },
          ],
        },
      ],
    },
  ],
};

export const SUPER_ADMIN_SIDEBAR_DATA: SidebarData = {
  user: {
    name: "John Doe",
    email: "jane@example.com",
    role: "Admin",
    avatar: "/avatars/jane.png",
  },
  teams: [
    {
      name: "FieldFieldTrack360",
      logo: Building2,
      plan: "Enterprise",
    },
  ],
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
          menuKey: "dashboard",
        },
        {
          title: "Super Admin",
          icon: Shield,
          menuKey: "super_admin",
          items: [
            {
              title: "Organizations",
              url: "/organizations",
              menuKey: "organizations",
            },
          ],
        },
      ],
    },
  ],
};

export const ROUTE_PERMISSIONS: Record<
  string,
  {
    requiredPermissions?: string[];
    requiredPermissionGroups?: string[];
    requiredRoles?: string[];
    requireAll?: boolean;
  }
> = {
  "/": {
    requiredPermissions: ["dashboard.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/products": {
    requiredPermissions: ["products.read"],
    requiredRoles: ["admin", "merchant"],
    requireAll: false,
  },
  "/categories": {
    requiredPermissions: ["inventory.read"],
    requiredRoles: ["admin", "merchant"],
    requireAll: false,
  },
  "/inventory": {
    requiredPermissions: ["inventory.read"],
    requiredRoles: ["admin", "merchant"],
    requireAll: false,
  },
  "/merchants": {
    requiredPermissions: ["users.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/merchants/orders": {
    requiredPermissions: ["orders.read"],
    requiredRoles: ["admin", "merchant"],
    requireAll: false,
  },
  "/merchants/products": {
    requiredPermissions: ["products.read"],
    requiredRoles: ["admin", "merchant"],
    requireAll: false,
  },
  "/merchants/payments": {
    requiredPermissions: ["payments.read"],
    requiredRoles: ["admin", "merchant"],
    requireAll: false,
  },
  "/drivers": {
    requiredPermissions: ["users.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/drivers/orders": {
    requiredPermissions: ["deliveries.read"],
    requiredRoles: ["admin", "driver"],
    requireAll: false,
  },
  "/drivers/tracking": {
    requiredPermissions: ["deliveries.read"],
    requiredRoles: ["admin", "driver"],
    requireAll: false,
  },
  "/drivers/payments": {
    requiredPermissions: ["payments.read"],
    requiredRoles: ["admin", "driver"],
    requireAll: false,
  },
  "/buyers": {
    requiredPermissions: ["users.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/buyers/orders": {
    requiredPermissions: ["business_orders.read"],
    requiredRoles: ["admin", "business"],
    requireAll: false,
  },
  "/buyers/partnerships": {
    requiredPermissions: ["partnerships.read"],
    requiredRoles: ["admin", "business"],
    requireAll: false,
  },
  "/buyers/insurance": {
    requiredPermissions: ["insurance.read"],
    requiredRoles: ["admin", "business"],
    requireAll: false,
  },
  "/settings": {
    requiredPermissions: ["profile.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/settings/account": {
    requiredPermissions: ["profile.update"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/settings/appearance": {
    requiredPermissions: ["profile.update"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/settings/notifications": {
    requiredPermissions: ["profile.update"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/settings/display": {
    requiredPermissions: ["profile.update"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/settings/reset-password": {
    requiredPermissions: ["profile.update"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/drivers.$orderId": {
    requiredPermissions: ["orders"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/organizations": {
    requiredPermissions: ["organizations.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/tracking": {
    requiredPermissions: ["orders"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/user-management": {
    requiredPermissions: ["users.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/user-management/roles": {
    requiredPermissions: ["users.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/user-territory": {
    requiredPermissions: ["users.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/calendar": {
    requiredPermissions: ["calendar.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
  "/calendar/upcoming-visit/": {
    requiredPermissions: ["calendar.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
};
