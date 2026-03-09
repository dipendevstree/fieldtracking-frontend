import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/use-auth-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoginUser, ViewType } from "./layout/types";
import { getProfileName } from "@/lib/utils";
import { useViewType } from "@/context/view-type-context";
import { Switch } from "@/components/ui/switch";
import { usePermission } from "@/permissions/hooks/use-permission";
import { useEffect } from "react";
import { User, Settings, LogOut, LucideIcon } from "lucide-react";
import moment from "moment";
import StatusBadge from "@/components/ui/status-badge";
import { useLogout } from "@/features/auth/sign-in/services/sign-in-services";

interface MenuItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface ProfileDropdownProps {
  user?: LoginUser | null;
  menuItems?: MenuItem[];
  showLogout?: boolean;
  logoutRedirectPath?: string;
  onLogout?: () => void;
  className?: string;
  avatarSize?: "sm" | "md" | "lg";
}

const AVATAR_SIZES = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    label: "Profile",
    href: "/settings/general-settings",
    icon: User,
  },
  {
    label: "Settings",
    href: "/settings/general-settings",
    icon: Settings,
  },
];

const permissionForViewTypeToggle: { admin: string; self: string }[] = [
  {
    admin: "leave_management_dashboard",
    self: "my_leave",
  },
  {
    admin: "attendance_dashboard",
    self: "my_attendance",
  },
];

export function ProfileDropdown({
  menuItems = DEFAULT_MENU_ITEMS,
  showLogout = true,
  // onLogout,
  className = "",
  avatarSize = "md",
}: Readonly<ProfileDropdownProps>) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { mutate: logoutRequest } = useLogout(() => {
    logout();
    navigate({ to: "/sign-in", replace: true });
  });
  const { hasAccess } = usePermission();
  const { viewType, setViewType, viewTypeToggle, setViewTypeToggle } =
    useViewType();

  const handleLogout = () => {
    if (user && user.isSuperAdmin) {
      logout();
      navigate({ to: "/superadmin-sign-in", replace: true });
      return;
    }
    let deviceId = localStorage.getItem("deviceId");
    logoutRequest({
      deviceId,
      isWeb: true,
    });
  };

  const avatarSizeClass = AVATAR_SIZES[avatarSize];
  const userName = getProfileName(user?.firstName || user?.userName || "");

  useEffect(() => {
    const showViewTypeToggle = permissionForViewTypeToggle.some((item) => {
      return hasAccess(item.admin) && hasAccess(item.self);
    });
    setViewTypeToggle(showViewTypeToggle);
  }, [user?.role?.permissions]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative ${avatarSizeClass} rounded-full ${className}`}
        >
          <Avatar className={`${avatarSizeClass} cursor-pointer`}>
            <AvatarImage
              src={user?.profileUrl || userName}
              alt={`@${user?.name}`}
            />
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-row space-x-2">
            <div>
              <Avatar className={`${avatarSizeClass} cursor-pointer`}>
                <AvatarImage
                  src={user?.profileUrl || userName}
                  alt={`@${user?.name}`}
                />
                <AvatarFallback>{userName}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm leading-none font-medium mb-1">
                {user?.isSuperAdmin
                  ? user?.name?.replace(/^./, (c) => c.toUpperCase())
                  : user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-muted-foreground text-xs leading-none break-all max-w-[180px]">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        {viewTypeToggle && (
          <>
            <DropdownMenuSeparator />
            {/* View Type Toggle */}
            <div className="p-2">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-medium ${
                    viewType === ViewType.Admin ? "text-black" : "text-gray-400"
                  }`}
                >
                  Admin View
                </span>
                <Switch
                  checked={viewType === ViewType.Self}
                  onCheckedChange={(checked) =>
                    setViewType(checked ? ViewType.Self : ViewType.Admin)
                  }
                  className="data-[state=unchecked]:bg-black data-[state=checked]:bg-black"
                />
                <span
                  className={`text-sm font-medium ${
                    viewType === ViewType.Self ? "text-black" : "text-gray-400"
                  }`}
                >
                  Self View
                </span>
              </div>
            </div>
          </>
        )}

        {!user?.isSuperAdmin && menuItems.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {menuItems.map((item, index) => {
                if (item.label === "Settings" && !user?.superAdminCreatedBy) {
                  return;
                }
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={index}
                    asChild={!!item.href}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={item.onClick ? "cursor-pointer" : ""}
                  >
                    {item.href ? (
                      <Link to={item.href} className="flex items-center">
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <>
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </>
        )}

        {showLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        )}

        {user?.organization && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="flex flex-col p-2 gap-2">
                <p className="flex justify-between text-[14px]">
                  Plan Status{" "}
                  <StatusBadge
                    status={
                      user?.organization?.isActive ? "Active" : "Inactive"
                    }
                  />
                </p>
                <p className="flex justify-between text-[14px]">
                  Expiry Date
                  <span className="text-red-500 font-medium">
                    {user?.organization?.planEndDate
                      ? moment(user?.organization?.planEndDate).format(
                          "DD MMM YYYY",
                        )
                      : "N/A"}
                  </span>
                </p>
              </div>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Usage examples:

// Basic usage with default items
export function BasicProfileDropdown() {
  const { user } = useAuthStore();
  return <ProfileDropdown user={user} />;
}

// Custom menu items
export function CustomProfileDropdown() {
  const { user } = useAuthStore();
  const customMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      shortcut: "⌘D",
    },
    {
      label: "Profile",
      href: "/profile",
      shortcut: "⇧⌘P",
    },
    {
      label: "Billing",
      href: "/billing",
      shortcut: "⌘B",
    },
    {
      label: "Settings",
      href: "/settings",
      shortcut: "⌘S",
    },
    {
      label: "Help Center",
      onClick: () => window.open("https://help.example.com", "_blank"),
      shortcut: "⌘H",
    },
  ];

  return (
    <ProfileDropdown
      user={user}
      menuItems={customMenuItems}
      avatarSize="lg"
      onLogout={() => {
        // Custom logout logic
        // Clear auth tokens, etc.
      }}
    />
  );
}

// Minimal dropdown without logout
export function MinimalProfileDropdown() {
  const { user } = useAuthStore();
  return (
    <ProfileDropdown
      user={user}
      menuItems={[
        { label: "View Profile", href: "/profile" },
        { label: "Edit Profile", href: "/profile/edit" },
      ]}
      showLogout={false}
      avatarSize="sm"
    />
  );
}
