import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useModuleName } from "@/hooks/use-module-name";
import { socketForVisit as socket } from "../../socket/socket";
import { useAuth } from "@/stores/use-auth-store";
import { usePermissionData } from "@/hooks/use-permission-data";
import { useSEO } from "@/config/seo";
import { TopContactBanner } from "./top-contact-banner";
import { OrganizationPlanStatus } from "./types";
import { useEffect } from "react";

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
        ...data,
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
    if (user && user.isSuperAdmin) return;

    const server = socket(getToken());
    if (!server) return;

    const handleConnect = () => {
      server.emit("track_permissions", { roleId: user?.role?.roleId });
      server.emit("track_settings", { organizationId: user?.organizationID });
    };

    const handleLiveRolesAndSettingChange = () => {
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
      server.disconnect();
    };
  }, []);

  useSEO(pathName);

  const showRenewBanner = user?.role?.roleName.toLowerCase() === "admin" && user?.organization?.planStatus && ![OrganizationPlanStatus.ACTIVE, OrganizationPlanStatus.TRIAL].includes(user?.organization?.planStatus as OrganizationPlanStatus);

  const planText = (() => {
    if ([OrganizationPlanStatus.EXPIRED, OrganizationPlanStatus.GRACE_PERIOD].includes(user?.organization?.planStatus as OrganizationPlanStatus)) {
      return "Renew Plan";
    } else if (user?.organization?.planStatus === OrganizationPlanStatus.SUSPENDED) {
      return "Activate Plan";
    }
    return "";
  })();

  useEffect(() => {
    if (showRenewBanner) {
      document.body.classList.add('has-top-banner');
    } else {
      document.body.classList.remove('has-top-banner');
    }

    return () => document.body.classList.remove('has-top-banner');
  }, [showRenewBanner]);

  return (
    <>
      {/* Top Contact Banner - Escapes layout container constraints to be full width */}
      {showRenewBanner && (
        <div className="fixed top-0 left-0 right-0 z-[100] w-full">
          <TopContactBanner planText={planText} />
        </div>
      )}
      
      <header
        className={cn(
          "bg-background flex flex-col w-[inherit]",
          fixed && "header-fixed peer/header fixed z-50",
          showRenewBanner ? "rounded-none" : "rounded-md",
        offset > 10 && fixed ? "shadow-sm" : "shadow-none",
        showRenewBanner ? "has-banner" : "",
        className,
      )}
      {...props}
    >
      <div className="flex h-16 w-full items-center gap-3 p-4 sm:gap-4 border-b border-border/40">
        <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
        <Separator orientation="vertical" className="h-6" />
        <p className="font-medium">{pathName}</p>
        {children}
      </div>
    </header>
    </>
  );
};

Header.displayName = "Header";
