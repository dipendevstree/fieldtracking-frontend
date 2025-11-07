import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/features/settings";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="settings">
      <Settings />
    </ProtectedRoute>
  );
}
