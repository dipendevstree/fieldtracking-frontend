import { createFileRoute } from "@tanstack/react-router";
import SettingsNotifications from "@/features/settings/notifications";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute(
  "/_authenticated/settings/notification-settings"
)({
  component: () => (
    <ProtectedRoute requiredPermission="notification-settings">
      <SettingsNotifications />
    </ProtectedRoute>
  ),
});
