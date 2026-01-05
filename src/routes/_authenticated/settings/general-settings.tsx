import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";
import GeneralSettings from "@/features/settings/General";

export const Route = createFileRoute(
  "/_authenticated/settings/general-settings"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="general-settings">
      <GeneralSettings />
    </ProtectedRoute>
  );
}
