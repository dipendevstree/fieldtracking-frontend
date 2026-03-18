import { useAuthStore } from "@/stores/use-auth-store";
import { OrganizationPlanStatus } from "@/components/layout/types";

// Define the capabilities that can be restricted by plan
type PlanCapability =
  | "view"
  | "edit"
  | "add"
  | "delete"
  | "export"
  | "viewOwn"
  | "viewGlobal";

// Reusable policy sets
const FULL_ACCESS: PlanCapability[] = [
  "view",
  "edit",
  "add",
  "delete",
  "export",
  "viewOwn",
  "viewGlobal",
];
const READ_ONLY_ACCESS: PlanCapability[] = [
  "view",
  "export",
  "viewOwn",
  "viewGlobal",
];

/**
 * Scalable configuration for plan-based restrictions.
 * Each status maps to a policy (list of allowed capabilities).
 */
const PLAN_POLICIES: Record<OrganizationPlanStatus, PlanCapability[]> = {
  [OrganizationPlanStatus.ACTIVE]: FULL_ACCESS,
  [OrganizationPlanStatus.TRIAL]: FULL_ACCESS,
  [OrganizationPlanStatus.UPCOMING]: FULL_ACCESS,
  [OrganizationPlanStatus.GRACE_PERIOD]: READ_ONLY_ACCESS,
  [OrganizationPlanStatus.EXPIRED]: READ_ONLY_ACCESS,
  [OrganizationPlanStatus.SUSPENDED]: [], // No access
};

export function usePlanStatus() {
  const { user } = useAuthStore();
  const planStatus = user?.organization?.planStatus as OrganizationPlanStatus;

  const canPerformPlanAction = (action: PlanCapability) => {
    if (user?.isSuperAdmin) return true;

    // Use the defined policy for the current plan status, default to no access if status is unknown
    const allowedActions = PLAN_POLICIES[planStatus] || [];
    return allowedActions.includes(action);
  };

  return {
    planStatus,
    isGracePeriod: planStatus === OrganizationPlanStatus.GRACE_PERIOD,
    isExpired: planStatus === OrganizationPlanStatus.EXPIRED,
    isSuspended: planStatus === OrganizationPlanStatus.SUSPENDED,
    isActive:
      planStatus === OrganizationPlanStatus.ACTIVE ||
      planStatus === OrganizationPlanStatus.TRIAL,
    canPerformPlanAction,
  };
}
