import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useModuleName } from "@/hooks/use-module-name";
import { socketForVisit as socket } from "../../socket/socket";
import { useAuth } from "@/stores/use-auth-store";
import { usePermissionData } from "@/hooks/use-permission-data";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0);
  const pathName = useModuleName();
  const { user, getToken, updateUser } = useAuth();
  const { mutate } = usePermissionData({
    onSuccess(data) {
      updateUser({
        ...user,
        role: {
          ...user?.role,
          ...data?.role,
        },
        organization: {
          ...user?.organization,
          ...data.organization,
        },
      });
    },
  });

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const server = socket(getToken());
    if (!server) return;

    const handleConnect = () => {
      server.emit("track_permissions", { roleId: user?.role?.roleId });
      server.emit("track_settings", { organizationId: user?.organizationID });
    };

    const handleLiveRolesAndSettingChange = (data: Record<string, any>) => {
      if (data.userId === user?.id) return;
      mutate();
    };

    if (server.connected) {
      handleConnect();
    } else {
      server.on("connect", handleConnect);
    }

    server.on("permission_change", handleLiveRolesAndSettingChange);
    server.on("setting_change", handleLiveRolesAndSettingChange);

    return () => {
      server.off("connect", handleConnect);
      server.off("permission_change", handleLiveRolesAndSettingChange);
      server.off("setting_change", handleLiveRolesAndSettingChange);
    };
  }, []);

  return (
    <header
      className={cn(
        "bg-background flex h-16 items-center gap-3 p-4 sm:gap-4",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
        offset > 10 && fixed ? "shadow-sm" : "shadow-none",
        className
      )}
      {...props}
    >
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />
      <p className="font-medium">{pathName}</p>
      {children}
    </header>
  );
};

Header.displayName = "Header";
