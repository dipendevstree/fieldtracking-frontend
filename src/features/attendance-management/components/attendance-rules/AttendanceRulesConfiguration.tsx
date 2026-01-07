import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Loader2,
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
      frequency: undefined,
    },
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
          typeof day === "string" ? parseInt(day, 10) : day
        ),
        latemarkApplicableTiers: rulesData.latemarkApplicableTiers ?? [],
        frequency: rulesData.frequency,
      });
    }
  }, [rulesData, form]);

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
    form.formState.isDirty
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            (form.watch("enableLateMarkRule") ?? true) &&
            (form.watch("latemarkApplicableTiers")?.length ?? 0) > 0 &&
            !!form.watch("frequency")
          }
          desc="Late attendance tracking"
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
                      <FormDescription>
                        Number of minutes allowed after scheduled check-in time
                      </FormDescription>
                      {form.formState.errors.gracePeriodMinutes && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.gracePeriodMinutes.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  If scheduled check-in is 9:00 AM and grace period is 15
                  minutes, employee can check-in until 9:15 AM without being
                  marked as late.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 2. Overtime Calculation */}
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
                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">
                    How it works:
                  </span>
                  When enabled, the system will automatically calculate overtime
                  hours when employees work beyond their scheduled hours.
                  {/* Overtime rates and policies can be configured separately in
                  payroll settings. */}
                </div>
              </CardContent>
            )}
          </Card>

          {/* 3. Late Mark Policy */}
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

            {(form.watch("enableLateMarkRule") ?? true) && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                {/* Applicable Tiers and Frequency */}
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
                        <FormDescription>
                          User tiers this rule applies to (leave empty for all
                          tiers)
                        </FormDescription>
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
                          <FormDescription>
                            How often this rule should be applied
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Late Mark Threshold and Leave Deduction - enabled only when applicableTiers and frequency are set */}
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
                            <FormDescription>
                              Number of late marks before leave deduction
                            </FormDescription>
                            {form.formState.errors.lateMarkLimit && (
                              <p className="text-sm text-red-600">
                                {form.formState.errors.lateMarkLimit.message}
                              </p>
                            )}
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
                                  disabled={
                                    Number(form.watch("lateMarkLimit")) < 1 ||
                                    !canEdit
                                  }
                                />
                              </FormControl>
                              <span className="text-sm text-muted-foreground w-12">
                                days
                              </span>
                            </div>
                            <FormDescription>
                              Days to deduct from leave balance
                            </FormDescription>
                            {form.formState.errors.leaveDeductionCount && (
                              <p className="text-sm text-red-600">
                                {
                                  form.formState.errors.leaveDeductionCount
                                    .message
                                }
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  Configure applicable tiers and frequency to enable late mark
                  policy. After 3 late marks in a month, the system will
                  automatically deduct 1 day from the user's leave balance.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 4. Week Off Days */}
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
                                              (value) => value !== day.value
                                            )
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

              {/* Example Box */}
              <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                <span className="font-semibold block mb-1">Example:</span>
                If Sunday is selected as week off, employees won't be required
                to check-in on Sundays, and it won't affect their attendance
                percentage.
              </div>
            </CardContent>
          </Card>

          <PermissionGate requiredPermission="attendance_rules" action="edit">
            <div className="flex gap-4 justify-end">
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
            </div>
          </PermissionGate>
        </form>
      </Form>
    </Main>
  );
}
