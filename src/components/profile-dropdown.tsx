import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/use-auth-store";
import { Link } from "@tanstack/react-router";
import { LoginUser } from "./layout/types";
import { getProfileName } from "@/lib/utils";

interface MenuItem {
  label: string;
  href?: string;
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
    href: "/settings",
    shortcut: "⇧⌘P",
  },
  {
    label: "Settings",
    href: "/settings",
    shortcut: "⌘S",
  },
];

export function ProfileDropdown({
  menuItems = DEFAULT_MENU_ITEMS,
  showLogout = true,
  // onLogout,
  className = "",
  avatarSize = "md",
}: Readonly<ProfileDropdownProps>) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const avatarSizeClass = AVATAR_SIZES[avatarSize];
  const userName = getProfileName(user?.firstName || user?.userName || "");

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
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user?.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        {!user?.isSuperAdmin && menuItems.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {menuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  asChild={!!item.href}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={item.onClick ? "cursor-pointer" : ""}
                >
                  {item.href ? (
                    <Link to={item.href}>
                      {item.label}
                      {item.shortcut && (
                        <DropdownMenuShortcut>
                          {item.shortcut}
                        </DropdownMenuShortcut>
                      )}
                    </Link>
                  ) : (
                    <>
                      {item.label}
                      {item.shortcut && (
                        <DropdownMenuShortcut>
                          {item.shortcut}
                        </DropdownMenuShortcut>
                      )}
                    </>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {showLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
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
