import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetMyLeaves } from "@/features/leave-management/services/leave-action.hook";
import { LeaveBalanceCard } from "../../user-view/components/leave-balance-card";
import { useAuthStore } from "@/stores/use-auth-store";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  rulesData: any;
}

const cardStyles = [
  { headerBg: "bg-blue-50", titleColor: "text-blue-700" },
  { headerBg: "bg-green-50", titleColor: "text-green-700" },
  { headerBg: "bg-purple-50", titleColor: "text-purple-700" },
  { headerBg: "bg-orange-50", titleColor: "text-orange-700" },
];

export function LeaveBalanceDialog({ open, onOpenChange, rulesData }: Props) {
  const { user } = useAuthStore();
  const allowWorkFromHome = user?.organization?.allowWorkFromHome;
  const { data: myLeavesList } = useGetMyLeaves();
  const leaveList = myLeavesList?.length
    ? myLeavesList?.filter((item: any) =>
        item && item.id && allowWorkFromHome ? true : !item.superAdminCreatedBy,
      )
    : [];
  let errorMessage =
    "Leave encashment requests can be submitted only between 1st December and 15th December each year.";
  const { setOpen, setCurrentRow } = useLeaveRequestStore();
  const handleClick = (data: any) => {
    const hasRequiredBalance =
      parseFloat(rulesData?.minimumEncashmentDaysRequired || "0") <=
      parseFloat(data?.leaveBalance?.remaining || "0");
    const hasBalance = parseFloat(data?.leaveBalance?.remaining || "0") > 0;
    const condition =
      data.showLeaveEncashmentButton && hasBalance && hasRequiredBalance;
    if (condition) {
      setOpen("leave-encashment");
      setCurrentRow(data);
    } else {
      if (!hasBalance) {
        toast.error("Invalid Action", {
          description: "You do not have any available leave balance.",
          position: "top-right",
          duration: 5000,
        });
      } else if (!hasRequiredBalance) {
        toast.error("Invalid Action", {
          description: `A minimum leave balance of ${rulesData?.minimumEncashmentDaysRequired} days is required to proceed with encashment.`,
          position: "top-right",
          duration: 5000,
        });
      } else {
        toast.error("Invalid Action", {
          description: errorMessage,
          position: "top-right",
          duration: 5000,
        });
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] !max-w-5xl overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>
            Leave Balance for {new Date().getFullYear()}
          </DialogTitle>
        </DialogHeader>
        {leaveList?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaveList?.map((item: any, index: number) => {
              const bal = item?.leaveBalance || {};
              const totalQuota =
                parseFloat(bal.earned || "0") +
                parseFloat(bal.carryForward || "0");
              const used = parseFloat(bal.used || "0");
              const percentage =
                totalQuota > 0 ? Math.round((used / totalQuota) * 100) : 0;

              return (
                <LeaveBalanceCard
                  key={item?.id}
                  title={item?.name}
                  total={totalQuota}
                  taken={used}
                  balance={parseFloat(bal.remaining || "0")}
                  percentage={percentage}
                  headerBg={cardStyles[index % cardStyles.length].headerBg}
                  titleColor={cardStyles[index % cardStyles.length].titleColor}
                  showLeaveEncashmentButton={item.showLeaveEncashmentButton}
                  handleClick={() => handleClick(item)}
                  errorMessage={errorMessage}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-base text-slate-500">
            Leave balance for the {new Date().getFullYear()} year has not been
            generated. Please apply for leave or wait for the next accrual
            cycle.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
