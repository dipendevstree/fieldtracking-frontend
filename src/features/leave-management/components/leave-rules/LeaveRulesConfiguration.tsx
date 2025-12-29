import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Settings,
  RefreshCw,
  Layers,
  Banknote,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";

import { useGetAllLeaveTypes } from "../../services/leave-type.action.hook";
import { LeaveRulesSchema } from "../../data/schema";
import {
  useGetLeaveRulesConfig,
  useUpdateLeaveRulesConfig,
} from "../../services/leave-rules-config.action.hook";
import { Main } from "@/components/layout/main";

export default function LeaveRulesConfiguration() {
  const { data: leaveTypes = [] } = useGetAllLeaveTypes();

  const { data: rulesData, isLoading: isRulesLoading } =
    useGetLeaveRulesConfig();

  const { mutate: updateRules, isPending: isSaving } =
    useUpdateLeaveRulesConfig();

  const form = useForm<z.infer<typeof LeaveRulesSchema>>({
    resolver: zodResolver(LeaveRulesSchema),
    defaultValues: {
      sandwichLeaveRuleActive: false,
      maximumSandwichLeaveDays: 0,
      crossLeaveDeductionRuleActive: false,
      primaryLeaveType: "",
      secondaryLeaveTypes: [],
      leaveCarryForwardRuleActive: false,
      maximumCarryForwardDays: 0,
      carryForwardExpiryMonths: 0,
      leaveEncashmentRuleActive: false,
      maximumEncashmentDays: 0,
      minimumEncashmentDaysRequired: 0,
    },
  });

  useEffect(() => {
    if (rulesData) {
      form.reset({
        sandwichLeaveRuleActive: rulesData.sandwichLeaveRuleActive ?? false,
        maximumSandwichLeaveDays: rulesData.maximumSandwichLeaveDays ?? 0,
        crossLeaveDeductionRuleActive:
          rulesData.crossLeaveDeductionRuleActive ?? false,
        primaryLeaveType: rulesData.primaryLeaveType ?? "",
        secondaryLeaveTypes: rulesData.secondaryLeaveTypes ?? [],
        leaveCarryForwardRuleActive:
          rulesData.leaveCarryForwardRuleActive ?? false,
        maximumCarryForwardDays: rulesData.maximumCarryForwardDays ?? 0,
        carryForwardExpiryMonths: rulesData.carryForwardExpiryMonths ?? 0,
        leaveEncashmentRuleActive: rulesData.leaveEncashmentRuleActive ?? false,
        maximumEncashmentDays: rulesData.maximumEncashmentDays ?? 0,
        minimumEncashmentDaysRequired:
          rulesData.minimumEncashmentDaysRequired ?? 0,
      });
    }
  }, [rulesData, form]);

  const onSubmit = (data: z.infer<typeof LeaveRulesSchema>) => {
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
          title="Sandwich Leave"
          enabled={form.watch("sandwichLeaveRuleActive")}
          desc="Count holidays between leaves"
        />
        <SummaryCard
          title="Carry Forward"
          enabled={form.watch("leaveCarryForwardRuleActive")}
          desc="Roll over unused leaves"
        />
        <SummaryCard
          title="Encashment"
          enabled={form.watch("leaveEncashmentRuleActive")}
          desc="Convert leaves to cash"
        />
        <SummaryCard
          title="Cross-Leave Use"
          enabled={form.watch("crossLeaveDeductionRuleActive")}
          desc="Use alternate leave types"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 2. Sandwich Leave Rule */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Sandwich Leave Rule
                    </CardTitle>
                    <CardDescription>
                      Count weekends and holidays between leave days as part of
                      the leave
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="sandwichLeaveRuleActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {form.watch("sandwichLeaveRuleActive") && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <FormField
                  control={form.control}
                  name="maximumSandwichLeaveDays"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Maximum Sandwich Days</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <span className="text-sm text-muted-foreground">
                          days
                        </span>
                      </div>
                      <FormDescription>
                        Maximum number of holidays/weekends that can be counted
                        as sandwich leave
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  User applies leave on Friday and Monday. If enabled, Saturday
                  & Sunday (2 days) will be counted as leave, making it a 4-day
                  leave instead of 2.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 3. Cross-Leave Deduction */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Cross-Leave Deduction
                    </CardTitle>
                    <CardDescription>
                      Allow users to use alternate leave types when primary
                      leave balance is insufficient
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="crossLeaveDeductionRuleActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {form.watch("crossLeaveDeductionRuleActive") && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                {/* Primary Type */}
                <FormField
                  control={form.control}
                  name="primaryLeaveType"
                  render={({ field }) => (
                    <FormItem className="max-w-md">
                      <FormLabel>Primary Backup Leave Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leaveTypes.map((type: any) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This leave type will be used first when the requested
                        leave type has insufficient balance
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Secondary Types Checkboxes */}
                <FormField
                  control={form.control}
                  name="secondaryLeaveTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Allowed Backup Leave Types</FormLabel>
                      </div>
                      <div className="border rounded-md p-4 space-y-3">
                        {leaveTypes.map((item: any) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="secondaryLeaveTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                      disabled={
                                        item.id ===
                                        form.watch("primaryLeaveType")
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormDescription>
                        Select which leave types can be used as backup when the
                        primary leave type has insufficient balance
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  User applies for 6 days of Sick Leave but only has 4 days
                  available. With this rule enabled, the system will
                  automatically deduct 4 days from Sick Leave and 2 days from
                  Annual Leave (primary backup) to fulfill the request.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 4. Leave Carry Forward */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Leave Carry Forward
                    </CardTitle>
                    <CardDescription>
                      Allow users to carry forward unused leaves to next period
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="leaveCarryForwardRuleActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {form.watch("leaveCarryForwardRuleActive") && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="maximumCarryForwardDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Carry Forward Days</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground w-12">
                            days
                          </span>
                        </div>
                        <FormDescription>
                          Maximum leaves that can be carried forward
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carryForwardExpiryMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carry Forward Expiry</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground w-12">
                            months
                          </span>
                        </div>
                        <FormDescription>
                          Carried forward leaves expire after this period
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  User has 8 unused leaves at year end. With max carry forward
                  of 10 days, all 8 days will be added to next year's balance
                  and must be used within 3 months.
                </div>
              </CardContent>
            )}
          </Card>

          {/* 5. Leave Encashment */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-base">
                      Leave Encashment
                    </CardTitle>
                    <CardDescription>
                      Allow users to convert unused leaves into cash payment
                    </CardDescription>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="leaveEncashmentRuleActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      {field.value && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Enabled
                        </Badge>
                      )}
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>

            {form.watch("leaveEncashmentRuleActive") && (
              <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="maximumEncashmentDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Encashment Days</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground w-12">
                            days
                          </span>
                        </div>
                        <FormDescription>
                          Maximum leaves that can be encashed per year
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minimumEncashmentDaysRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Balance Required</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground w-12">
                            days
                          </span>
                        </div>
                        <FormDescription>
                          Minimum leave balance user must maintain
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                {/* Example Box */}
                <div className="bg-slate-50 border rounded-md p-4 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Example:</span>
                  User has 20 unused leaves. With max encashment of 15 days and
                  min balance of 5 days, they can encash up to 15 days but must
                  keep at least 5 days in their balance.
                </div>
              </CardContent>
            )}
          </Card>

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
        </form>
      </Form>
    </Main>
  );
}
