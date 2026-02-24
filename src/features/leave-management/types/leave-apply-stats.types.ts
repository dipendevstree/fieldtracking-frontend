export interface SandwichDateItem {
  date: string;
  type: "weekoff" | "holiday";
  name?: string;
}

export interface InBetweenHolidayDate {
  date: string;
  name: string;
}

export interface SandwichData {
  sandwichLeaveCount: number;
  holidayCount: number;
  leaveCount: number;
  weekOffDayCount: number;
  inBetweenCount: number;
  beforeCount: number;
  afterCount: number;
  totalDays: number;
  sandwichDates: SandwichDateItem[];
  inBetweenHolidayDates: InBetweenHolidayDate[];
  inBetweenWeekOffDates: string[];
  beforeDates: SandwichDateItem[];
  afterDates: SandwichDateItem[];
  startDate: string;
  endDate: string;
}

export interface LeaveRuleConfig {
  sandwichLeaveRuleActive: boolean;
  maximumSandwichLeaveDays: number | null;
  crossLeaveDeductionRuleActive: boolean;
  primaryLeaveType: string | null;
  secondaryLeaveTypes: string[] | null;
  primaryLeaveTypeData: { name: string; [key: string]: any } | null;
  secondaryLeaveTypesData: Array<{ name: string; [key: string]: any }> | null;
  leaveCarryForwardRuleActive: boolean;
  maximumCarryForwardDays: number | null;
  carryForwardExpiryMonths: number | null;
  leaveEncashmentRuleActive: boolean;
  maximumEncashmentDays: number | null;
  minimumEncashmentDaysRequired: number | null;
}

export interface LeaveApplyStatsResponse {
  sandwichData: SandwichData;
  availableBalance: number;
  leaveRuleConfig: LeaveRuleConfig;
}
