import {
  Building2,
  Home,
  MapPin,
  Settings,
  Shield,
  UserCircle,
  Calendar1Icon,
  ShieldCheck,
  ChartPie,
  FileText,
  CalendarDays,
  Users,
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
      name: "FieldTrack360",
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
          icon: Building2,
          menuKey: "customers",
          items: [
            {
              title: "Customer Directory",
              url: "/customers",
              menuKey: "customer_directory",
            },
            // {
            //   title: "Add Customer",
            //   url: "/customers/add-customer",
            //   menuKey: "add_customer",
            // },
            {
              title: "Customer Type",
              url: "/customer-type",
              menuKey: "customer_type",
            },
          ],
        },

        {
          title: "User Management",
          icon: UserCircle,
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
          icon: Calendar1Icon,
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
              title: "Analytics",
              url: "/calendar/analytics",
              menuKey: "analytic",
            },
          ],
        },
        {
          title: "Approvals",
          icon: ShieldCheck,
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
              title: "Expense Analytics",
              url: "/approvals/reports-analytics",
              menuKey: "reports_analytics",
            },
          ],
        },
        {
          title: "Reports",
          icon: ChartPie,
          menuKey: "reports",
          items: [
            {
              title: "Expense Reports",
              url: "/reports",
              menuKey: "reports",
            },
            {
              title: "Custom Reports",
              url: "/reports/custom-reports",
              menuKey: "custom_reports",
            },
            {
              title: "Reports History",
              url: "/reports/reports-history",
              menuKey: "reports_history",
            },
          ],
        },
        {
          title: "Leave Management",
          icon: CalendarDays,
          menuKey: "leave_management",
          items: [
            {
              title: "Dashboard",
              url: "/leave-management/dashboard",
              menuKey: "leave_management_dashboard",
            },
            {
              title: "User Tiers",
              url: "/leave-management/user-tiers",
              menuKey: "user_tiers",
            },
            {
              title: "Leave Request",
              url: "/leave-management/leave-request",
              menuKey: "leave_request",
            },
            {
              title: "Leave Rules",
              url: "/leave-management/leave-rules",
              menuKey: "leave_rules",
            },
            {
              title: "List of Holidays",
              url: "/leave-management/list-of-holidays",
              menuKey: "list_of_holidays",
            },
            {
              title: "Holiday Templates",
              url: "/leave-management/holiday-templates",
              menuKey: "holiday_templates",
            },
          ],
        },
        {
          title: "Attendance",
          icon: Users,
          menuKey: "attendance_management",
          items: [
            {
              title: "Attendance Dashboard",
              url: "/attendance-management/attendance-dashboard",
              menuKey: "attendance_dashboard",
            },
            {
              title: "My Attendance",
              url: "/attendance-management/my-attendance",
              menuKey: "my_attendance",
            },
            {
              title: "Attendace Rules",
              url: "/attendance-management/attendance-rules",
              menuKey: "attendance_rules",
            },
            {
              title: "Attendance-Approvals",
              url: "/attendance-management/attendance-approvals",
              menuKey: "attendance_approvals",
            },
            {
              title: "Shifts",
              url: "/attendance-management/shifts",
              menuKey: "attendance_shifts",
            },
          ],
        },
      ],
    },
    {
      title: "Quick Access",
      items: [
        {
          title: "Settings",
          icon: Settings,
          menuKey: "settings",
          items: [
            {
              title: "Expense Categories",
              url: "/settings/expense-categories",
              menuKey: "expense_categories",
            },
            {
              title: "Leave Types",
              url: "/settings/leave-types",
              menuKey: "leave_types",
            },
            {
              title: "Holiday Types",
              url: "/settings/holiday-types",
              menuKey: "holiday_types",
            },
            {
              title: "Approvers",
              url: "/settings/approvers",
              menuKey: "approvers",
            },
            {
              title: "Leave Approvals",
              url: "/settings/leave-approvals",
              menuKey: "leave_approvals",
            },
            {
              title: "Notification Settings",
              url: "/settings/notification-settings",
              menuKey: "notification-settings",
            },
            {
              title: "General Settings",
              url: "/settings/general-settings",
              menuKey: "general-settings",
            },
          ],
        },
        // {
        //   title: "Documentation",
        //   url: "/",
        //   icon: FileText,
        //   menuKey: "documentation",
        // },
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
      name: "FieldTrack Pro",
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
        {
          title: "Terms & Conditions",
          url: "/termsAndConditions",
          icon: FileText,
          menuKey: "termsAndConditions",
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
  "/documentation": {
    requiredPermissions: ["documentation.read"],
    requiredRoles: ["admin"],
    requireAll: false,
  },
};

export const VIEW_ROUTE_PERMISSIONS: Record<
  string,
  {
    requiredPermissions?: string;
    requiredPermissionGroups?: string[];
    requiredRoles?: string[];
    action?: "add" | "edit" | "viewOwn" | "viewGlobal" | "delete";
    requireAll?: boolean;
  }
> = {
  "/": {
    requiredPermissions: "dashboard",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/approvals": {
    requiredPermissions: "approvals",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/approvals/expense-category": {
    requiredPermissions: "approvals",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/buyers": {
    requiredPermissions: "buyers",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/calendar": {
    requiredPermissions: "calendar",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/categories": {
    requiredPermissions: "categories",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/customers": {
    requiredPermissions: "customers",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/customer-type": {
    requiredPermissions: "customer_type",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/drivers": {
    requiredPermissions: "drivers",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/help-center": {
    requiredPermissions: "help-center",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/inventory": {
    requiredPermissions: "inventory",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/livetracking": {
    requiredPermissions: "live_tracking",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/managements": {
    requiredPermissions: "managements",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/merchants": {
    requiredPermissions: "merchants",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/notifications": {
    requiredPermissions: "notifications",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/organizations": {
    requiredPermissions: "organizations",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/products": {
    requiredPermissions: "products",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/reports": {
    requiredPermissions: "reports",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/setting": {
    requiredPermissions: "setting",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/settings": {
    requiredPermissions: "settings",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/user-management": {
    requiredPermissions: "user-management",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/user-management/roles": {
    requiredPermissions: "roles_permission",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/users": {
    requiredPermissions: "users",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/user-territory": {
    requiredPermissions: "user-territory",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/attendance-management/attendance-dashboard": {
    requiredPermissions: "attendance_management",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/attendance-management/my-attendance": {
    requiredPermissions: "my_attendance",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/attendance-management/attendance-rules": {
    requiredPermissions: "attendance_rules",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
  "/attendance-management/attendance-approvals": {
    requiredPermissions: "attendance_approvals",
    requiredRoles: ["admin"],
    action: "viewOwn",
    requireAll: false,
  },
};
