import ApproversPage from "@/features/settings/Approvers";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/approvers")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="approvers">
      <ApproversPage />
    </ProtectedRoute>
  );
}
