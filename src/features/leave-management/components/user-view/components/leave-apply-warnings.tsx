import { useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  TriangleAlert,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDropDownLabel } from "@/utils/commonFunction";
import type { LeaveApplyStatsResponse } from "@/features/leave-management/types/leave-apply-stats.types";

interface LeaveApplyWarningsProps {
  stats: LeaveApplyStatsResponse;
  selectedLeaveTypeName: string;
  selectedLeaveTypeId: string;
  isWorkFromHomeLeave?: boolean;
}

export function LeaveApplyWarnings({
  stats,
  selectedLeaveTypeName,
  selectedLeaveTypeId,
  isWorkFromHomeLeave,
}: LeaveApplyWarningsProps) {
  const [sandwichExpanded, setSandwichExpanded] = useState(false);

  const { sandwichData, availableBalance, leaveRuleConfig } = stats;
  const totalDays = sandwichData?.totalDays ?? 0;
  const leaveCount = sandwichData?.leaveCount ?? 0;
  const sandwichLeaveCount = sandwichData?.sandwichLeaveCount ?? 0;
  const inBetweenCount = sandwichData?.inBetweenCount ?? 0;

  const warnings: React.ReactNode[] = [];

  // ─── Warning 1: Balance (RED) ───
  if (availableBalance <= 0) {
    warnings.push(
      <div
        key="no-balance"
        className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-semibold">No Leave Balance</span>
            <p className="mt-0.5">
              You have no remaining balance for this leave type. Your current
              balance is{" "}
              <span className="font-medium">{availableBalance} day(s)</span>.
            </p>
          </div>
        </div>
      </div>,
    );
  } else if (availableBalance > 0 && availableBalance < totalDays) {
    warnings.push(
      <div
        key="insufficient-balance"
        className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-semibold">Insufficient Leave Balance</span>
            <p className="mt-0.5">
              This leave requires{" "}
              <span className="font-medium">{totalDays} day(s)</span> but you
              only have{" "}
              <span className="font-medium">
                {availableBalance} day(s)
              </span>{" "}
              remaining.
              {sandwichLeaveCount > 0 && (
                <span className="text-red-600">
                  {" "}
                  (Leave: {leaveCount} day(s) + Sandwich: {sandwichLeaveCount}{" "}
                  day(s))
                </span>
              )}
            </p>
          </div>
        </div>
      </div>,
    );
  }

  // ─── Warning 2: Sandwich Leave (AMBER) ───
  if (leaveRuleConfig?.sandwichLeaveRuleActive && sandwichLeaveCount > 0) {
    const allAffectedDates: Array<{
      date: string;
      type: string;
      name?: string;
    }> = [
      ...(sandwichData?.beforeDates ?? []),
      ...(sandwichData?.inBetweenHolidayDates?.map((d) => ({
        date: d.date,
        type: "holiday" as const,
        name: d.name,
      })) ?? []),
      ...(sandwichData?.inBetweenWeekOffDates?.map((d) => ({
        date: d,
        type: "weekoff" as const,
      })) ?? []),
      ...(sandwichData?.afterDates ?? []),
    ];

    warnings.push(
      <div
        key="sandwich"
        className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800"
      >
        <div className="flex items-start gap-2">
          <TriangleAlert
            className="text-amber-500 shrink-0 mt-0.5"
            size={16}
          />
          <div className="flex-1">
            <span className="font-semibold">Sandwich Leave Detected</span>
            <p className="mt-0.5">
              <span className="font-medium">{sandwichLeaveCount}</span>{" "}
              sandwich day(s) detected
              {(() => {
                const maxCap = leaveRuleConfig?.maximumSandwichLeaveDays;
                const isCapped =
                  maxCap != null && sandwichLeaveCount > maxCap;
                const effectiveSandwich = isCapped
                  ? maxCap
                  : sandwichLeaveCount;
                const effectiveTotal = leaveCount + effectiveSandwich;
                return (
                  <>
                    {isCapped && (
                      <>
                        , capped to{" "}
                        <span className="font-medium">{effectiveSandwich}</span>
                      </>
                    )}
                    . Total deduction:{" "}
                    <span className="font-medium">
                      {effectiveTotal} day(s)
                    </span>
                    .
                  </>
                );
              })()}
            </p>
            {leaveRuleConfig?.maximumSandwichLeaveDays != null &&
              sandwichLeaveCount >
                leaveRuleConfig.maximumSandwichLeaveDays && (
                <p className="mt-1 text-amber-600 text-xs">
                  Maximum sandwich deduction is capped at{" "}
                  {leaveRuleConfig.maximumSandwichLeaveDays} day(s).
                </p>
              )}
            {allAffectedDates.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setSandwichExpanded(!sandwichExpanded)}
                  className="flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                >
                  {sandwichExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  {sandwichExpanded ? "Hide" : "View"} affected dates (
                  {allAffectedDates.length})
                </button>
                {sandwichExpanded && (
                  <div className="mt-1.5 space-y-1 pl-1 border-l-2 border-amber-200 ml-0.5">
                    {allAffectedDates.map((d, idx) => (
                      <div key={idx} className="text-xs text-amber-700 pl-2">
                        <span className="font-medium">
                          {format(new Date(d.date), "dd MMM yyyy")}
                        </span>{" "}
                        —{" "}
                        <span className="capitalize">
                          {formatDropDownLabel(d.type)}
                        </span>
                        {d.name && (
                          <span className="text-amber-600"> ({d.name})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>,
    );
  }

  // ─── Warning 3: Cross-Leave Deduction (AMBER) ───
  if (
    leaveRuleConfig?.crossLeaveDeductionRuleActive &&
    availableBalance < totalDays &&
    !isWorkFromHomeLeave
  ) {
    // Build the full deduction chain, filtering out the selected leave type
    const fallbackTypes: { id: string; name: string }[] = [];

    if (
      leaveRuleConfig.primaryLeaveTypeData &&
      leaveRuleConfig.primaryLeaveType !== selectedLeaveTypeId
    ) {
      fallbackTypes.push({
        id: leaveRuleConfig.primaryLeaveType!,
        name: leaveRuleConfig.primaryLeaveTypeData.name,
      });
    }

    if (leaveRuleConfig.secondaryLeaveTypesData?.length) {
      for (const sec of leaveRuleConfig.secondaryLeaveTypesData) {
        if (
          sec.id !== selectedLeaveTypeId &&
          !fallbackTypes.some((f) => f.id === sec.id)
        ) {
          fallbackTypes.push({ id: sec.id, name: sec.name });
        }
      }
    }

    if (fallbackTypes.length > 0) {
      const fallbackNames = fallbackTypes.map((f) => f.name);
      const formattedNames =
        fallbackNames.length === 1
          ? fallbackNames[0]
          : `${fallbackNames.slice(0, -1).join(", ")} and ${fallbackNames[fallbackNames.length - 1]}`;

      warnings.push(
        <div
          key="cross-leave"
          className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800"
        >
          <div className="flex items-start gap-2">
            <TriangleAlert
              className="text-amber-500 shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <span className="font-semibold">Cross-Leave Deduction</span>
              <p className="mt-0.5">
                If your{" "}
                <span className="font-medium">{selectedLeaveTypeName}</span>{" "}
                balance is insufficient, the shortfall will be deducted from
                your{" "}
                <span className="font-medium">{formattedNames}</span>{" "}
                balance as per the Cross-Leave Deduction Rule.
                {fallbackTypes.length > 1 &&
                  " If all balances are insufficient, your leave balance will go into negative."}
              </p>
            </div>
          </div>
        </div>,
      );
    } else {
      // No unique fallback types — balance will go negative
      warnings.push(
        <div
          key="negative-balance"
          className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800"
        >
          <div className="flex items-start gap-2">
            <TriangleAlert
              className="text-amber-500 shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <span className="font-semibold">Negative Balance</span>
              <p className="mt-0.5">
                Your{" "}
                <span className="font-medium">{selectedLeaveTypeName}</span>{" "}
                balance is insufficient. If you proceed, your leave balance will
                go into negative.
              </p>
            </div>
          </div>
        </div>,
      );
    }
  }

  // ─── Warning 4: In-Between Holidays/Week-offs (BLUE) ───
  if (inBetweenCount > 0 && !leaveRuleConfig?.sandwichLeaveRuleActive) {
    const inBetweenDetails: string[] = [
      ...(sandwichData?.inBetweenHolidayDates?.map(
        (d) => `${format(new Date(d.date), "dd MMM")} (${d.name})`,
      ) ?? []),
      ...(sandwichData?.inBetweenWeekOffDates?.map(
        (d) => `${format(new Date(d), "dd MMM")} (Week Off)`,
      ) ?? []),
    ];

    warnings.push(
      <div
        key="in-between-info"
        className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700"
      >
        <div className="flex items-start gap-2">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-semibold">Non-Working Days Included</span>
            <p className="mt-0.5">
              Your leave period includes{" "}
              <span className="font-medium">
                {inBetweenCount} non-working day(s)
              </span>
              : {inBetweenDetails.join(", ")}. These days are included in your
              leave period.
            </p>
          </div>
        </div>
      </div>,
    );
  }

  if (warnings.length === 0) return null;

  return <div className="space-y-2">{warnings}</div>;
}

/**
 * Returns true if there are amber-level (sandwich or cross-leave) warnings present.
 */
export function hasAmberWarnings(stats: LeaveApplyStatsResponse): boolean {
  const { sandwichData, leaveRuleConfig, availableBalance } = stats;
  const sandwichLeaveCount = sandwichData?.sandwichLeaveCount ?? 0;
  const totalDays = sandwichData?.totalDays ?? 0;

  if (leaveRuleConfig?.sandwichLeaveRuleActive && sandwichLeaveCount > 0)
    return true;
  if (
    leaveRuleConfig?.crossLeaveDeductionRuleActive &&
    leaveRuleConfig?.primaryLeaveTypeData &&
    availableBalance < totalDays
  )
    return true;

  return false;
}
