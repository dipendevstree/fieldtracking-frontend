import { Switch } from "@/components/ui/switch";

const activityNotifications = [
  "Notify me when the Sales Rep reaches to the visit location",
  "Notify me when the Sales Rep goes out of the network",
  "Notify me when the Sales Rep is Idle",
  "Notify me when the Sales Rep is not able to complete the visit on-time",
  "Notify me when the Sales Rep submits the Expenses",
  "Notify me when a New Customer or Bulk Customers Upload is added in the system",
  "Notify me when an unauthorized login attempt happens in the system",
  "Notify me when a Visit is rescheduled, cancelled or assigned another Sales Rep",
];

export default function Notifications() {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Activity Monitoring</h2>
      <div className="divide-y divide-gray-200">
        {activityNotifications.map((label, idx) => (
          <div key={idx} className="flex items-center justify-between py-4">
            <span className="text-base font-normal">{label}</span>
            <Switch defaultChecked />
          </div>
        ))}
      </div>
    </div>
  );
}