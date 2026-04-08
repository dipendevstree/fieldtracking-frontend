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
    isTrial: planStatus === OrganizationPlanStatus.TRIAL,
    isPaid:
      planStatus !== OrganizationPlanStatus.TRIAL &&
      planStatus !== OrganizationPlanStatus.SUSPENDED,
    canPerformPlanAction,
  };
}

/**
 * Utility to check if a plan (found by ID in a list) is a paid plan.
 * A plan is considered "paid" if its name doesn't contain the word "trial" (case-insensitive).
 */
export const checkIfPaidPlan = (plans: any[], planId: string): boolean => {
  if (!planId || !plans) return false;
  const selectedPlan = plans.find((p: any) => p.id === planId);
  return !!(
    selectedPlan && !selectedPlan.name?.toLowerCase().includes("trial")
  );
};
