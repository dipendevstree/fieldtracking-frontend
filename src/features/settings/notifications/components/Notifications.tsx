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

const activityNotifications = [
  "Notify me when the Sales Rep reaches to the visit location",
  "Notify me when the Sales Rep goes out of the network",
  "Notify me when the Sales Rep is Idle",
  "Notify me when the Sales Rep's check-in is delayed beyond the scheduled time.",
  "Notify me when the Sales Rep is not able to complete the visit on-time",
  "Notify me when the Sales Rep submits the Expenses",
  "Notify me when a New Customer or Bulk Customers Upload is added in the system",
  "Notify me when an unauthorized login attempt happens in the system",
  "Notify me when a Visit is rescheduled, cancelled or assigned another Sales Rep",
] as const;

const activityNotificationsApiKeys = [
  "notifyWhenSalesRepReachesVisitLocation",
  "notifyWhenSalesRepGoesOutOfNetwork",
  "notifyWhenSalesRepIsIdle",
  "notifyWhenSalesRepCheckInDelayedBeyondScheduledTime",
  "notifyWhenSalesRepNotAbleToCompleteVisitOnTime",
  "notifyWhenSalesRepSubmitsExpenses",
  "notifyWhenNewOrBulkCustomersAdded",
  "notifyWhenUnauthorizedLoginAttempt",
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
  }, [form, isFetched]);

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

    updateNotifications(finalPayload);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-white rounded-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold">Activity Monitoring</h2>

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

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}