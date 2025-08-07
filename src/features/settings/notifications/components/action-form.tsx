import { Controller, useForm } from "react-hook-form";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Textarea } from '@/components/ui/textarea'
import CustomButton from "@/components/shared/custom-button";
import {
  notificationConfigFormSchema,
  notificationRuleFormSchema,
  // notificationTemplateFormSchema,
  TNotificationConfigFormSchema,
  TNotificationRuleFormSchema,
  // TNotificationTemplateFormSchema
} from "../data/schema";
import {
  NotificationConfig,
  NotificationRule,
  //  NotificationTemplate
} from "../type/type";

// Notification Configuration Action Form
interface NotificationConfigFormProps {
  currentConfig?: Partial<NotificationConfig>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TNotificationConfigFormSchema) => void;
}

export function NotificationConfigActionForm({
  currentConfig,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: NotificationConfigFormProps) {
  const isEdit = !!currentConfig;

  const form = useForm<TNotificationConfigFormSchema>({
    resolver: zodResolver(notificationConfigFormSchema),
    defaultValues: {
      expenseNotifications: {
        warnForExpiry:
          currentConfig?.expenseNotifications?.warnForExpiry ?? true,
        unsubmittedReminders:
          currentConfig?.expenseNotifications?.unsubmittedReminders ?? true,
        reminderFrequency:
          currentConfig?.expenseNotifications?.reminderFrequency ?? "weekly",
        reminderTime:
          currentConfig?.expenseNotifications?.reminderTime ?? "09:00",
      },
      fieldActivityAlerts: {
        geofenceAlerts:
          currentConfig?.fieldActivityAlerts?.geofenceAlerts ?? true,
        inactivityAlerts:
          currentConfig?.fieldActivityAlerts?.inactivityAlerts ?? true,
        checkinAlerts:
          currentConfig?.fieldActivityAlerts?.checkinAlerts ?? false,
        breakAlerts: currentConfig?.fieldActivityAlerts?.breakAlerts ?? true,
      },
      emailNotifications: {
        sendVisitNotesEmail:
          currentConfig?.emailNotifications?.sendVisitNotesEmail ?? true,
        notificationEmail:
          currentConfig?.emailNotifications?.notificationEmail ?? "",
        emailFrequency:
          currentConfig?.emailNotifications?.emailFrequency ?? "daily",
      },
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: TNotificationConfigFormSchema) => {
    onSubmitValues(values);
  };

  const handleDialogChange = (state: boolean) => {
    if (!state) reset();
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-2xl overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit
                ? "Edit Notification Configuration"
                : "Configure Notifications"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update notification configuration settings."
                : "Configure alerts, reminders, and notification preferences."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="notification-config-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Expense Notifications Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Expense Notifications</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="warnForExpiry">
                      Warn for Expenses Nearing Expiry
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send alerts when expenses are close to expiry
                    </p>
                  </div>
                  <Controller
                    name="expenseNotifications.warnForExpiry"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="unsubmittedReminders">
                      Unsubmitted Expense Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Remind users about pending expense submissions
                    </p>
                  </div>
                  <Controller
                    name="expenseNotifications.unsubmittedReminders"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                  <Controller
                    name="expenseNotifications.reminderFrequency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.expenseNotifications?.reminderFrequency && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.expenseNotifications.reminderFrequency.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Controller
                    name="expenseNotifications.reminderTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="reminderTime"
                        type="time"
                        placeholder="Enter reminder time"
                        value={field.value || ""}
                      />
                    )}
                  />
                  {errors.expenseNotifications?.reminderTime && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.expenseNotifications.reminderTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Field Activity Alerts Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Field Activity Alerts</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="geofenceAlerts">
                      Geofencing Breach Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when reps enter/exit designated areas
                    </p>
                  </div>
                  <Controller
                    name="fieldActivityAlerts.geofenceAlerts"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inactivityAlerts">
                      Long Inactivity Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alert for extended periods of inactivity
                    </p>
                  </div>
                  <Controller
                    name="fieldActivityAlerts.inactivityAlerts"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="checkinAlerts">
                      Check-in/Check-out Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when reps check in or out
                    </p>
                  </div>
                  <Controller
                    name="fieldActivityAlerts.checkinAlerts"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="breakAlerts">Long Break Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert for extended break periods
                    </p>
                  </div>
                  <Controller
                    name="fieldActivityAlerts.breakAlerts"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Email Notifications Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Email Notifications</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendVisitNotesEmail">
                      Send Visit Notes via Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Email visit summaries and notes
                    </p>
                  </div>
                  <Controller
                    name="emailNotifications.sendVisitNotesEmail"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">
                    Notification Email Address
                  </Label>
                  <Controller
                    name="emailNotifications.notificationEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="notificationEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={field.value || ""}
                      />
                    )}
                  />
                  {errors.emailNotifications?.notificationEmail && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.emailNotifications.notificationEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFrequency">Email Frequency</Label>
                  <Controller
                    name="emailNotifications.emailFrequency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Summary</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.emailNotifications?.emailFrequency && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.emailNotifications.emailFrequency.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton
            type="submit"
            loading={loading}
            form="notification-config-form"
          >
            {isEdit ? "Update Configuration" : "Save Configuration"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Notification Rule Action Form
interface NotificationRuleFormProps {
  currentRule?: Partial<NotificationRule>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TNotificationRuleFormSchema) => void;
}

export function NotificationRuleActionForm({
  currentRule,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
}: NotificationRuleFormProps) {
  const isEdit = !!currentRule;

  const form = useForm<TNotificationRuleFormSchema>({
    resolver: zodResolver(notificationRuleFormSchema),
    defaultValues: {
      ruleName: currentRule?.ruleName ?? "",
      ruleType: currentRule?.ruleType ?? "expense",
      isEnabled: currentRule?.isEnabled ?? true,
      conditions: currentRule?.conditions ?? {},
      actions: currentRule?.actions ?? {},
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: TNotificationRuleFormSchema) => {
    onSubmitValues(values);
  };

  const handleDialogChange = (state: boolean) => {
    if (!state) reset();
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[80vh] !max-w-md overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Notification Rule" : "Add Notification Rule"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {isEdit
                ? "Update notification rule."
                : "Create a new notification rule."}
            </DialogDescription>
          </div>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form
            id="notification-rule-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Rule Name Field */}
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name *</Label>
              <Controller
                name="ruleName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="ruleName"
                    placeholder="Enter rule name"
                    value={field.value || ""}
                  />
                )}
              />
              {errors.ruleName && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.ruleName.message}
                </p>
              )}
            </div>

            {/* Rule Type Field */}
            <div className="space-y-2">
              <Label htmlFor="ruleType">Rule Type *</Label>
              <Controller
                name="ruleType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="field">Field</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ruleType && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.ruleType.message}
                </p>
              )}
            </div>

            {/* Is Enabled Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isEnabled">Enabled</Label>
                <Controller
                  name="isEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <CustomButton
            type="submit"
            loading={loading}
            form="notification-rule-form"
          >
            {isEdit ? "Update Rule" : "Create Rule"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
