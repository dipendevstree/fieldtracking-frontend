import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useGetLeaveRulesConfig } from "../../../services/leave-rules-config.action.hook";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export default function LeaveRuleList() {
  const navigate = useNavigate();
  const { data: rulesData, isLoading: isRulesLoading } =
    useGetLeaveRulesConfig();
  return (
    <div className="bg-slate-50 border rounded-md p-6 text-sm text-slate-700">
      <p className="font-bold mb-2">Leave Rules:</p>
      {isRulesLoading ? (
        <Loader2 className="animate-spin" />
      ) : rulesData ? (
        [
          rulesData?.sandwichLeaveRuleActive,
          rulesData?.crossLeaveDeductionRuleActive,
          rulesData?.leaveCarryForwardRuleActive,
          rulesData?.leaveEncashmentRuleActive,
        ].includes(true) ? (
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {rulesData?.sandwichLeaveRuleActive && (
              <li>
                <span className="font-semibold">Sandwich Leave Rule:</span>{" "}
                Maximum{" "}
                <span className="font-semibold">
                  {rulesData?.maximumSandwichLeaveDays}
                </span>{" "}
                days of sandwich leave can be deducted if you take sandwich
                leave.
              </li>
            )}
            {rulesData?.crossLeaveDeductionRuleActive && (
              <li>
                <span className="font-semibold">
                  Cross Leave Deduction Rule:
                </span>{" "}
                If Your requested leave type balance is insufficient then System
                will use{" "}
                <span className="font-semibold">
                  {rulesData?.primaryLeaveTypeData?.name}
                </span>{" "}
                leave type and after backup leave type{" "}
                <span className="font-semibold">
                  (
                  {rulesData?.secondaryLeaveTypesData
                    .map((item: any) => item.name)
                    .join(", ")}
                  )
                </span>{" "}
                balance will be deducted from your leave balance.
              </li>
            )}
            {rulesData?.leaveCarryForwardRuleActive && (
              <li>
                <span className="font-semibold">Leave Carry Forward Rule:</span>{" "}
                Maximum{" "}
                <span className="font-semibold">
                  {rulesData?.maximumCarryForwardDays}
                </span>{" "}
                days of leave can be carried forward to the next year.
              </li>
            )}
            {rulesData?.leaveEncashmentRuleActive && (
              <li>
                <span className="font-semibold">Leave Encashment Rule:</span>{" "}
                Maximum{" "}
                <span className="font-semibold">
                  {rulesData?.maximumEncashmentDays}
                </span>{" "}
                days of leave can be encashed. But you need to have at least{" "}
                <span className="font-semibold">
                  {rulesData?.minimumEncashmentDaysRequired}
                </span>{" "}
                days of leave balance.
              </li>
            )}
          </ul>
        ) : (
          <span className="text-slate-500 font-medium">
            There is no any active leave rule configured.
          </span>
        )
      ) : (
        <span className="text-slate-500 font-medium">
          Your organization has not set any leave rules yet.
          <PermissionGate requiredPermission="leave_rules" action="add">
            <Button
              onClick={() => navigate({ to: "/leave-management/leave-rules" })}
              variant="link"
              className="text-blue-600 px-1"
            >
              Set Leave Rules
            </Button>
          </PermissionGate>
        </span>
      )}
    </div>
  );
}
