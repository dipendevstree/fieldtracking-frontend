import { PermissionGate } from "@/permissions/components/PermissionGate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export default function LeaveRuleList({
  rulesData,
  isRulesLoading,
}: {
  rulesData: any;
  isRulesLoading: boolean;
}) {
  const navigate = useNavigate();
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
          <ul className="list-disc pl-5 mt-2 space-y-2">
            {rulesData?.sandwichLeaveRuleActive && (
              <li>
                <span className="font-semibold">Sandwich Leave Rule:</span> If
                leave is taken in a sandwich pattern (i.e., holidays or weekly
                offs falling between applied leave days), a maximum of{" "}
                <span className="font-semibold">
                  {rulesData?.maximumSandwichLeaveDays}
                </span>{" "}
                days may be deducted as sandwich leave.
              </li>
            )}

            {rulesData?.crossLeaveDeductionRuleActive && (
              <li>
                <span className="font-semibold">
                  Cross Leave Deduction Rule:
                </span>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    If the balance of the requested leave type is insufficient,
                    the system will automatically deduct leave from the{" "}
                    <span className="font-semibold">
                      {rulesData?.primaryLeaveTypeData?.name}
                    </span>{" "}
                    balance.
                  </li>

                  <li>
                    If the{" "}
                    <span className="font-semibold">
                      {rulesData?.primaryLeaveTypeData?.name}
                    </span>{" "}
                    balance is also insufficient, the remaining leave will be
                    deducted from the backup leave types{" "}
                    <span className="font-semibold">
                      (
                      {rulesData?.secondaryLeaveTypesData
                        ?.map((item: any) => item.name)
                        .join(", ")}
                      )
                    </span>
                    .
                  </li>
                  <li>
                    If all available leave balances are insufficient, the
                    requested leave type may result in a negative balance.
                  </li>
                </ul>
              </li>
            )}

            {rulesData?.leaveCarryForwardRuleActive && (
              <li>
                <span className="font-semibold">Leave Carry Forward Rule:</span>{" "}
                A maximum of{" "}
                <span className="font-semibold">
                  {rulesData?.maximumCarryForwardDays}
                </span>{" "}
                days of unused leave can be carried forward to the next year.
              </li>
            )}

            {rulesData?.leaveEncashmentRuleActive && (
              <li>
                <span className="font-semibold">Leave Encashment Rule:</span> A
                maximum of{" "}
                <span className="font-semibold">
                  {rulesData?.maximumEncashmentDays}
                </span>{" "}
                days of leave can be encashed, provided that at least{" "}
                <span className="font-semibold">
                  {rulesData?.minimumEncashmentDaysRequired}
                </span>{" "}
                days remain in the leave balance after encashment.
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
