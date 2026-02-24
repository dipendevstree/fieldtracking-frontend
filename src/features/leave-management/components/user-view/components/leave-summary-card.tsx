import type { LeaveApplyStatsResponse } from "@/features/leave-management/types/leave-apply-stats.types";

interface LeaveSummaryCardProps {
  stats: LeaveApplyStatsResponse;
}

export function LeaveSummaryCard({ stats }: LeaveSummaryCardProps) {
  const { sandwichData, availableBalance, leaveRuleConfig } = stats;
  const leaveCount = sandwichData?.leaveCount ?? 0;
  const sandwichLeaveCount = sandwichData?.sandwichLeaveCount ?? 0;

  const maxCap = leaveRuleConfig?.maximumSandwichLeaveDays;
  const isCapped =
    maxCap != null && sandwichLeaveCount > 0 && sandwichLeaveCount > maxCap;
  const effectiveSandwich = isCapped ? maxCap : sandwichLeaveCount;
  const effectiveTotal = leaveCount + effectiveSandwich;
  const balanceAfter = availableBalance - effectiveTotal;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Leave Summary
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        {/* Leave Days */}
        <span className="text-slate-500">Leave Days</span>
        <span className="text-right font-medium text-slate-700">
          {leaveCount} day(s)
        </span>

        {/* Sandwich Days — show capped info when applicable */}
        {sandwichLeaveCount > 0 && (
          <>
            <span className="text-slate-500">Sandwich Days</span>
            <span className="text-right font-medium text-slate-700">
              {isCapped ? (
                <>
                  <span className="line-through text-slate-400 mr-1">
                    {sandwichLeaveCount}
                  </span>
                  <span className="text-amber-600">
                    {effectiveSandwich} day(s){" "}
                    <span className="text-xs font-normal">(capped)</span>
                  </span>
                </>
              ) : (
                <>{sandwichLeaveCount} day(s)</>
              )}
            </span>
          </>
        )}

        {/* Total Deduction */}
        <span className="text-slate-500">Total Deduction</span>
        <span className="text-right font-medium text-slate-900">
          {effectiveTotal} day(s)
        </span>

        {/* Available Balance */}
        <span className="text-slate-500">Available Balance</span>
        <span className="text-right font-medium text-slate-700">
          {availableBalance} day(s)
        </span>

        {/* Balance After */}
        <span className="text-slate-500">Balance After</span>
        <span
          className={`text-right font-medium ${balanceAfter < 0 ? "text-red-600" : "text-slate-700"}`}
        >
          {balanceAfter} day(s)
        </span>
      </div>
    </div>
  );
}
