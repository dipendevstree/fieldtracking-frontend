import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlanDetails } from "@/features/organizations/services/plan-service";
import moment from "moment";
import StatusBadge from "./ui/status-badge";

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string | undefined;
}

export function PlanDetailsModal({
  isOpen,
  onClose,
  orgId,
}: PlanDetailsModalProps) {
  const { data, isLoading, error } = useGetPlanDetails(orgId, {
    enabled: isOpen && !!orgId,
  });

  const formatDate = (dateValue: string | null | undefined) =>
    dateValue ? moment(dateValue).format("DD MMM YYYY") : "N/A";

  // Helper for consistent row styling
  const DetailRow = ({
    label,
    value,
    isBadge = false,
  }: {
    label: string;
    value: any;
    isBadge?: boolean;
  }) => (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      {isBadge && value ? (
        <StatusBadge status={value} />
      ) : (
        <span className="text-xs font-semibold text-foreground text-right">
          {value || "N/A"}
        </span>
      )}
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      modal={true}
    >
      <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-base font-bold">
            Plan Details
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-4 pt-2">
          {isLoading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="py-6 text-center text-destructive text-xs font-medium">
              Failed to load plan details.
            </div>
          ) : !data || Object.keys(data).length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-xs">
              No plan details available.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Header */}
              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Status
                  </p>
                  <StatusBadge status={data.effectiveStatus || "N/A"} />
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Renewal/Expiry
                  </p>
                  <p className="text-xs font-bold text-destructive">
                    {formatDate(data.effectivePlanEndDate)}
                  </p>
                </div>
              </div>

              {/* Current Plan Section */}
              {data.currentPlan && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold uppercase text-muted-foreground mb-2">
                    Current Plan Details
                  </h4>
                  <div className="divide-y divide-border/50 border-t border-b">
                    <DetailRow
                      label="Plan Name"
                      value={data.currentPlan.plan?.name}
                    />
                    <DetailRow label="Type" value={data.currentPlan.planType} />
                    <DetailRow
                      label="Status"
                      value={data.currentPlan.status}
                      isBadge
                    />
                    <DetailRow
                      label="Start Date"
                      value={formatDate(data.currentPlan.planStartDate)}
                    />
                    <DetailRow
                      label="End Date"
                      value={formatDate(data.currentPlan.planEndDate)}
                    />
                    <DetailRow
                      label="Grace Period"
                      value={formatDate(data.currentPlan.gracePeriodEndDate)}
                    />
                  </div>

                  {data.currentPlan.notes && (
                    <div className="mt-2 p-2 bg-yellow-50/50 border border-yellow-100 rounded text-[11px] text-muted-foreground italic">
                      <span className="font-bold not-italic mr-1">Note:</span>{" "}
                      {data.currentPlan.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Upcoming Plan Section */}
              {data.upcomingPlan && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold uppercase text-primary mb-2">
                    Next Scheduled Plan
                  </h4>
                  <div className="bg-muted/40 px-2 rounded-lg">
                    <DetailRow
                      label="Plan Name"
                      value={data.upcomingPlan.plan?.name}
                    />
                    <DetailRow
                      label="Frequency"
                      value={data.upcomingPlan.frequency}
                    />
                    <DetailRow
                      label="Start Date"
                      value={formatDate(data.upcomingPlan.planStartDate)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
