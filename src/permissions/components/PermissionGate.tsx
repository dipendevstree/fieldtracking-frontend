import React from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { usePermission } from "../hooks/use-permission";
import { usePlanStatus } from "@/permissions/hooks/use-plan-status";
import CustomTooltip from "@/components/shared/custom-tooltip";

interface PermissionGateProps {
  children: React.ReactNode;
  requiredPermission: string;
  action?: "add" | "edit" | "viewOwn" | "viewGlobal" | "delete";
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  requiredPermission,
  action,
  fallback = null,
}: PermissionGateProps) {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.isSuperAdmin;

  const { hasAccess, canPerformAction, hasRolePermission } = usePermission();

  const { canPerformPlanAction, isGracePeriod, isExpired, isSuspended } =
    usePlanStatus();

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // ✅ Final decision
  const hasPermission = action
    ? canPerformAction(requiredPermission, action)
    : hasAccess(requiredPermission);

  if (hasPermission) {
    return <>{children}</>;
  }

  // ✅ Show disabled UI if user has role permission but is blocked by plan
  const hasRoleAccess = action
    ? hasRolePermission(requiredPermission, action)
    : hasAccess(requiredPermission);

  const blockedByPlan = action && !canPerformPlanAction(action as any);

  if (hasRoleAccess && blockedByPlan) {
    let tooltipMessage = "This action is disabled due to your plan status.";
    if (isExpired)
      tooltipMessage = "Your plan has expired. Please contact admin to renew.";
    if (isSuspended)
      tooltipMessage =
        "Your plan is suspended. Please contact admin for support.";
    if (isGracePeriod)
      tooltipMessage =
        "This action is disabled during the grace period. Please contact admin to renew.";

    return (
      <CustomTooltip title={tooltipMessage}>
        <div className="opacity-50 cursor-not-allowed inline-block">
          <div className="pointer-events-none">{children}</div>
        </div>
      </CustomTooltip>
    );
  }

  // ❌ No role permission → fallback (hide or replace)
  return <>{fallback}</>;
}
