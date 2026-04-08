import { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { AttendanceRulesSchema } from "../../data/schema";
import {
  useGetAttendanceRulesConfig,
  useUpdateAttendanceRulesConfig,
} from "../../services/attendance-rules-config.action.hook";
import { useGetAllTiers } from "@/features/settings/Approvers/services/approvers.hook";
import MultiSelect from "@/components/ui/MultiSelect";
import { Main } from "@/components/layout/main";
import { ATTENDANCE_RULE_FREQUENCY } from "@/data/app.data";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { usePermission } from "@/permissions/hooks/use-permission";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function AttendanceRulesConfiguration() {
  const { data: rulesData, isLoading: isRulesLoading } =
    useGetAttendanceRulesConfig();

  const { mutate: updateRules, isPending: isSaving } =
    useUpdateAttendanceRulesConfig();

  const { data: tiersData, isLoading: isTiersLoading } = useGetAllTiers();

  // Create tier options for MultiSelect
  const tierOptions = useMemo(() => {
    if (!tiersData) return [];
    return tiersData.map((tier: any) => ({
      value: tier.tierkey || tier.key || tier,
      label:
        tier.tierName ||
        tier.label ||
        tier.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    }));
  }, [tiersData]);

  // Create frequency options for SearchableSelect
  const frequencyOptions = useMemo(() => {
    return Object.values(ATTENDANCE_RULE_FREQUENCY).map((freq) => ({
      value: freq,
      label: freq.charAt(0).toUpperCase() + freq.slice(1).toLowerCase(),
    }));
  }, []);

  const { canPerformAction } = usePermission();
  const canEdit = canPerformAction("attendance_rules", "edit");

  const form = useForm<z.infer<typeof AttendanceRulesSchema>>({
    resolver: zodResolver(AttendanceRulesSchema),
    defaultValues: {
      gracePeriodMinutes: 0,
      enableOvertime: true,
      enableGracePeriod: true,
      enableLateMarkRule: true,
      lateMarkLimit: 1,
      leaveDeductionCount: 0,
      weekOffDays: [0], // Default to Sunday
      latemarkApplicableTiers: [],
      enableHoursBasedDeduction: false,
      frequency: ATTENDANCE_RULE_FREQUENCY.WEEKLY,
      hoursDeductionRules: [
        { shortageMin: 1, shortageMax: 5, deductionCount: 0.5 },
      ],
    },
    mode: "onChange", // Live validation for the grid
  });

  useEffect(() => {
    if (rulesData) {
      form.reset({
        gracePeriodMinutes: rulesData.gracePeriodMinutes ?? 0,
        enableOvertime: rulesData.enableOvertime ?? true,
        enableGracePeriod: rulesData.enableGracePeriod ?? true,
        enableLateMarkRule: rulesData.enableLateMarkRule ?? true,
        lateMarkLimit: rulesData.lateMarkLimit ?? 1,
        leaveDeductionCount: rulesData.leaveDeductionCount ?? 0,
        weekOffDays: (rulesData.weekOffDays ?? [0]).map((day: any) =>
          typeof day === "string" ? parseInt(day, 10) : day,
        ),
        latemarkApplicableTiers: rulesData.latemarkApplicableTiers ?? [],
        enableHoursBasedDeduction: rulesData.enableHoursBasedDeduction ?? false,
        frequency: rulesData.frequency || ATTENDANCE_RULE_FREQUENCY.WEEKLY,
        hoursDeductionRules: rulesData.hoursDeductionRules || [
          { shortageMin: 1, shortageMax: 5, deductionCount: 0.5 },
        ],
      });
    }
  }, [rulesData, form]);

  const {
    fields: hourlyFields,
    append: appendHourlyRule,
    remove: removeHourlyRule,
  } = useFieldArray({
    control: form.control,
    name: "hoursDeductionRules",
  });

  const onSubmit = (data: z.infer<typeof AttendanceRulesSchema>) => {
    updateRules(data);
  };

  // Helper to render Top Summary Cards
  const SummaryCard = ({
    title,
    enabled,
    desc,
  }: {
    title: string;
    enabled: boolean;
    desc: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="font-semibold text-sm">{title}</div>
        {enabled && <CheckCircle2 className="h-4 w-4 text-green-600" />}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold mb-1">
          {enabled ? "Enabled" : "Disabled"}
        </div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );

  // Sync with Global Store (Handles Tabs & Navigation blocking)
  useDirtyTracker(form.formState.isDirty);

  const { showExitPrompt, confirmExit, cancelExit } = useUnsavedChanges(
    form.formState.isDirty,
  );

  if (isRulesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Main className="space-y-6">
      {/* 1. Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Grace Period"
          enabled={form.watch("enableGracePeriod") ?? true}
          desc="Late check-in allowance"
        />
        <SummaryCard
          title="Overtime Calculation"
          enabled={form.watch("enableOvertime") ?? true}
          desc="Track extra working hours"
        />
        <SummaryCard
          title="Late Mark Policy"
          enabled={
            !!form.watch("enableLateMarkRule") &&
            (form.watch("latemarkApplicableTiers")?.length ?? 0) > 0 &&
            !!form.watch("frequency")
          }
          desc="Late attendance tracking"
        />
        <SummaryCard
          title="Hours Based Deduction"
          enabled={
            !!form.watch("enableHoursBasedDeduction") &&
            (form.watch("latemarkApplicableTiers")?.length ?? 0) > 0
          }
          desc="Deduction by work hours"
        />
        <SummaryCard
          title="Leave Deduction"
          enabled={form.watch("leaveDeductionCount") > 0}
          desc="Auto leave reduction"
        />
      </div>

      <ConfirmDialog
        open={showExitPrompt}
        onOpenChange={(isOpen) => {
          if (!isOpen) cancelExit();
        }}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={confirmExit}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. Grace Period */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">Grace Period</CardTitle>
                    <CardDescription>
                      Allow employees to check-in within a specified time after
                      their scheduled time
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="enableGracePeriod"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                          disabled={!canEdit}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {(form.watch("enableGracePeriod") ?? true) && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <FormField
                  control={form.control}
                  name="gracePeriodMinutes"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Grace Period Duration</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input type="number" {...field} disabled={!canEdit} />
                        </FormControl>
                        <span className="text-sm text-muted-foreground">
                          minutes
                        </span>
                      </div>

                      {form.formState.errors.gracePeriodMinutes && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.gracePeriodMinutes.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  If scheduled check-in is 9:00 AM and grace period is 15
                  minutes, employee can check-in until 9:15 AM without being
                  marked as late.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 2. Late Mark Policy */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Late Mark Policy
                    </CardTitle>
                    <CardDescription>
                      Set the threshold for marking attendance as late and
                      auto-leave deduction
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="enableLateMarkRule"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("enableHoursBasedDeduction", false);
                            }
                          }}
                          disabled={!canEdit}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {form.watch("enableLateMarkRule") && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                {/* Configuration Tiers and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="latemarkApplicableTiers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicable Tiers</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={tierOptions}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select applicable tiers..."
                            disabled={isTiersLoading || !canEdit}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {(form.watch("latemarkApplicableTiers")?.length ?? 0) > 0 && (
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rule Frequency</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={frequencyOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select frequency"
                              disabled={isTiersLoading || !canEdit}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {(form.watch("latemarkApplicableTiers")?.length ?? 0) > 0 &&
                  !!form.watch("frequency") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-200">
                      <FormField
                        control={form.control}
                        name="lateMarkLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Late Mark Threshold</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  disabled={!canEdit}
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground w-12">
                                times
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="leaveDeductionCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Leave Deduction Count</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  disabled={!canEdit}
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground w-12">
                                days
                              </span>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="col-span-full bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                        <span className="font-semibold block mb-1">
                          Example:
                        </span>
                        After {form.watch("lateMarkLimit") || "3"} late marks in
                        a {form.watch("frequency") || "month"}, the system will
                        automatically deduct{" "}
                        {form.watch("leaveDeductionCount") || "1"} day(s) from
                        the user's leave balance.
                      </div>
                    </div>
                  )}
              </CardContent>
            )}
          </Card>

          {/* 3. Hours Based Deduction */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Hours Based Deduction
                    </CardTitle>
                    <CardDescription>
                      Enable leave deduction based on total working hours
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="enableHoursBasedDeduction"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              // Disable Late Mark Rule
                              form.setValue("enableLateMarkRule", false);
                              // FORCE FREQUENCY TO WEEKLY
                              form.setValue(
                                "frequency",
                                ATTENDANCE_RULE_FREQUENCY.WEEKLY,
                              );
                            }
                          }}
                          disabled={!canEdit}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {form.watch("enableHoursBasedDeduction") && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="latemarkApplicableTiers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicable Tiers</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={tierOptions}
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select applicable tiers..."
                            disabled={isTiersLoading || !canEdit}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {(form.watch("latemarkApplicableTiers")?.length ?? 0) > 0 && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {hourlyFields.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                        <Clock className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-900">
                          No deduction rules configured
                        </p>
                        <p className="text-sm text-slate-500 mb-4 text-center max-w-lg">
                          Add ranges to automatically deduct leave based on
                          working hour shortages.
                        </p>
                        {canEdit && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              appendHourlyRule({
                                shortageMin: 1,
                                shortageMax: 5,
                                deductionCount: 0.5,
                              })
                            }
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Rule
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Header Row */}
                        <div className="grid grid-cols-10 gap-4 px-4 font-medium text-sm text-slate-500 mb-2">
                          <div className="col-span-3">Min Hours</div>
                          <div className="col-span-3">Max Hours</div>
                          <div className="col-span-3">Deduct Leave</div>
                          <div className="col-span-1"></div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {hourlyFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="grid grid-cols-10 gap-4 items-start bg-slate-50/50 p-3 rounded-lg border border-slate-100"
                            >
                              <div className="col-span-3">
                                <FormField
                                  control={form.control}
                                  name={`hoursDeductionRules.${index}.shortageMin`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <Input
                                          type="number"
                                          className="h-10 bg-white"
                                          placeholder="Start"
                                          {...field}
                                          disabled={!canEdit}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-[11px] mt-1" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="col-span-3">
                                <FormField
                                  control={form.control}
                                  name={`hoursDeductionRules.${index}.shortageMax`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <Input
                                          type="number"
                                          className="h-10 bg-white"
                                          placeholder="End"
                                          {...field}
                                          disabled={!canEdit}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-[11px] mt-1" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="col-span-3">
                                <FormField
                                  control={form.control}
                                  name={`hoursDeductionRules.${index}.deductionCount`}
                                  render={({ field }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <div className="relative">
                                          <Input
                                            type="number"
                                            step="0.5"
                                            className="h-10 bg-white pr-8"
                                            {...field}
                                            disabled={!canEdit}
                                          />
                                          <span className="absolute right-2 top-2.5 text-xs text-muted-foreground pointer-events-none">
                                            days
                                          </span>
                                        </div>
                                      </FormControl>
                                      <FormMessage className="text-[11px] mt-1" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="col-span-1 flex justify-center pt-1">
                                {canEdit && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="hover:text-red-500 hover:bg-red-50 h-9 w-9 p-0"
                                    onClick={() => removeHourlyRule(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {canEdit && (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => {
                                const currentRules = form.getValues(
                                  "hoursDeductionRules",
                                );
                                const lastRule =
                                  currentRules?.[currentRules.length - 1];

                                const nextMin = lastRule
                                  ? Number(lastRule.shortageMax) + 1
                                  : 1;

                                const nextDeduction = lastRule
                                  ? Number(lastRule.deductionCount) + 0.5
                                  : 0.5;

                                appendHourlyRule({
                                  shortageMin: nextMin,
                                  shortageMax: nextMin + 4,
                                  deductionCount: nextDeduction,
                                });
                              }}
                            >
                              <Plus className="h-4 w-4" /> Add Another Range
                            </Button>
                          </div>
                        )}
                      </>
                    )}

                    <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700 mt-4">
                      <span className="font-semibold block mb-1">
                        How it works:
                      </span>
                      Define ranges of total weekly working hours. If an
                      employee's hours fall within a range (e.g., 1 to 5 hours),
                      the corresponding leave deduction is applied.
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* 4. Overtime Calculation */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Overtime Calculation
                    </CardTitle>
                    <CardDescription>
                      Automatically calculate and track overtime hours for
                      employees
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="enableOvertime"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                          disabled={!canEdit}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {(form.watch("enableOvertime") ?? true) && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">
                    How it works:
                  </span>
                  When enabled, Automatically calculates overtime hours for work
                  beyond scheduled hours. Calculations are processed monthly.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 5. Week Off Days */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-base">Week Off Days</CardTitle>
                  <CardDescription>
                    Select which days of the week are considered as weekly offs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="weekOffDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Select Week Off Days</FormLabel>
                    </div>
                    <div className="border rounded-md p-4 space-y-3">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="weekOffDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            day.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.value,
                                            ),
                                          );
                                    }}
                                    disabled={!canEdit}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Selected days will be considered as weekly offs and won't
                      count as working days for attendance calculation
                    </FormDescription>
                    {form.formState.errors.weekOffDays && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.weekOffDays.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <PermissionGate requiredPermission="attendance_rules" action="edit">
              <Button
                type="submit"
                size="lg"
                className="w-40"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save All Rules"
                )}
              </Button>
            </PermissionGate>
          </div>
        </form>
      </Form>
    </Main>
  );
}
