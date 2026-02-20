import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeaveBalanceCard } from "../../user-view/components/leave-balance-card";
import { useAuthStore } from "@/stores/use-auth-store";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BanknoteArrowDown, Info } from "lucide-react";
import CustomTooltip from "@/components/shared/custom-tooltip";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  rulesData: any;
  myLeavesList: any;
  currentYear: number;
  setCurrentYear: (value: number) => void;
}

const cardStyles = [
  { headerBg: "bg-blue-50", titleColor: "text-blue-700" },
  { headerBg: "bg-green-50", titleColor: "text-green-700" },
  { headerBg: "bg-purple-50", titleColor: "text-purple-700" },
  { headerBg: "bg-orange-50", titleColor: "text-orange-700" },
];

export function LeaveBalanceDialog({
  open,
  onOpenChange,
  rulesData,
  myLeavesList,
  currentYear,
  setCurrentYear,
}: Props) {
  const { user } = useAuthStore();
  const allowWorkFromHome = user?.organization?.allowWorkFromHome;
  const leaveList = myLeavesList?.length
    ? myLeavesList?.filter((item: any) =>
        item && item.id && allowWorkFromHome ? true : !item.superAdminCreatedBy,
      )
    : [];
  let errorMessage =
    "Leave encashment requests can be submitted only between 1st December and 15th December each year.";
  const totalLeaveBalance = leaveList?.reduce((acc: number, item: any) => {
    return acc + parseFloat(item?.leaveBalance?.remaining || "0");
  }, 0);
  const { setOpen, setCurrentRow } = useLeaveRequestStore();
  const handleClick = () => {
    const hasRequiredBalance =
      parseFloat(rulesData?.minimumEncashmentDaysRequired || "0") <=
      totalLeaveBalance;
    const hasBalance = totalLeaveBalance > 0;
    const condition =
      rulesData?.showLeaveEncashmentButton && hasBalance && hasRequiredBalance;
    if (condition) {
      setOpen("leave-encashment");
      setCurrentRow(myLeavesList);
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
  const handleYearChange = (year: string) => {
    setCurrentYear(parseInt(year));
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] !max-w-5xl overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>
            <div className="flex items-center gap-2">
              Leave Balance for
              <Select
                value={currentYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[100px] bg-white border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }).map((_, i) => {
                    const year = moment().year() - 10 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </DialogTitle>
        </DialogHeader>
        {rulesData?.leaveEncashmentRuleActive && (
          <div className="flex items-center justify-between mb-2">
            <p>Total Balance: {totalLeaveBalance} days</p>
            <div className="flex items-center gap-2">
              {!rulesData?.showLeaveEncashmentButton && (
                <CustomTooltip
                  title={rulesData?.leaveEncashmentMessage || errorMessage}
                >
                  <Info size={16} className="text-slate-500 cursor-pointer" />
                </CustomTooltip>
              )}
              <Button
                variant="outline"
                disabled={!rulesData?.showLeaveEncashmentButton}
                onClick={() => handleClick()}
              >
                <BanknoteArrowDown size={16} className="mr-2" /> Apply Leave
                Encashment
              </Button>
            </div>
          </div>
        )}
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
