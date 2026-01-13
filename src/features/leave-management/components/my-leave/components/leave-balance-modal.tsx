import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetMyLeaves } from "@/features/leave-management/services/leave-action.hook";
import { LeaveBalanceCard } from "../../user-view/components/leave-balance-card";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const cardStyles = [
  { headerBg: "bg-blue-50", titleColor: "text-blue-700" },
  { headerBg: "bg-green-50", titleColor: "text-green-700" },
  { headerBg: "bg-purple-50", titleColor: "text-purple-700" },
  { headerBg: "bg-orange-50", titleColor: "text-orange-700" },
];

export function LeaveBalanceDialog({ open, onOpenChange }: Props) {
  const { data: myLeavesList } = useGetMyLeaves();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] !max-w-4xl overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>
            Leave Balance for {new Date().getFullYear()}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myLeavesList
            ?.filter((item: any) => item && item.id)
            ?.map((item: any, index: number) => {
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
                  //   onApply={() => openApplyLeaveDialog(item.id)}
                />
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
