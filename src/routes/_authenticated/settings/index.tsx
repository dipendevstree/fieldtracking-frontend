import SettingsPage from "@/features/settings";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="settings">
      <SettingsPage />
    </ProtectedRoute>
  );
}
