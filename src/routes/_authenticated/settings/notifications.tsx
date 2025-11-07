import { createFileRoute } from "@tanstack/react-router";
import SettingsNotifications from "@/features/settings/notifications";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/settings/notifications")({
  component: () => (
    <ProtectedRoute requiredPermission="settings">
      <SettingsNotifications />
    </ProtectedRoute>
  ),
});
