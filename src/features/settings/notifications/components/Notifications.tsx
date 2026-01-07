import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  useGetNotificationData,
  useUpdateNotifications,
} from "../services/notifications.hook";
import { Card } from "@/components/ui/card";
import { useDirtyTracker } from "../../store/use-unsaved-changes-store";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

const activityNotifications = [
  "Notify me when the Sales Rep reaches to the visit location",
  "Notify me when the Sales Rep's check-in is delayed beyond the scheduled time.",
  "Notify me when the Sales Rep is not able to complete the visit on-time",
  "Notify me when the Sales Rep submits the Expenses",
  "Notify me when a New Customer or Bulk Customers Upload is added in the system",
  "Notify me when a Visit is rescheduled, cancelled or assigned another Sales Rep",
] as const;

const activityNotificationsApiKeys = [
  "notifyWhenSalesRepReachesVisitLocation",
  "notifyWhenSalesRepCheckInDelayedBeyondScheduledTime",
  "notifyWhenSalesRepNotAbleToCompleteVisitOnTime",
  "notifyWhenSalesRepSubmitsExpenses",
  "notifyWhenNewOrBulkCustomersAdded",
  "notifyWhenVisitRescheduledCancelledOrReassigned",
] as const;

const schema = z.object({
  notifications: z.array(z.boolean()).length(activityNotifications.length),
});
type FormValues = z.infer<typeof schema>;

export default function Notifications() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      notifications: Array(activityNotifications.length).fill(false),
    },
  });

  const { isDirty } = form.formState;

  // Sync with Global Store (Handles Tabs & Navigation blocking)
  useDirtyTracker(isDirty);

  const { showExitPrompt, confirmExit, cancelExit } =
    useUnsavedChanges(isDirty);

  const { data, isLoading, isFetched } = useGetNotificationData();
  const { mutate: updateNotifications, isPending } = useUpdateNotifications();

  // Populate form with API data
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const values = activityNotificationsApiKeys.map(
        (key: any) => data[key] ?? false
      );
      form.reset({ notifications: values });
    } else {
      form.reset({
        notifications: Array(activityNotificationsApiKeys.length).fill(false),
      });
    }
  }, [form, isFetched, data]);

  // Submit handler
  const onSubmit = (values: FormValues) => {
    const payload = activityNotificationsApiKeys.reduce(
      (acc, key, idx) => {
        acc[key] = values.notifications[idx];
        return acc;
      },
      {} as Record<(typeof activityNotificationsApiKeys)[number], boolean>
    );

    const finalPayload = {
      ...payload,
    };

    updateNotifications(finalPayload, {
      onSuccess: () => {
        form.reset({ notifications: values.notifications });
      },
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white rounded-lg space-y-6"
      >
        <Card className="p-4 mt-6">
          <div className="divide-y divide-gray-200">
            {activityNotifications.map((label, idx) => (
              <div key={idx} className="flex items-center justify-between py-4">
                <span className="text-base font-normal">{label}</span>
                <Switch
                  checked={form.watch(`notifications.${idx}`)}
                  onCheckedChange={(val) =>
                    form.setValue(`notifications.${idx}`, val, {
                      shouldDirty: true,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        <PermissionGate
          requiredPermission="notification-settings"
          action={data && Object.keys(data).length > 0 ? "edit" : "add"}
        >
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </PermissionGate>
      </form>
    </>
  );
}
