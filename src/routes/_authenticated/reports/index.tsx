import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import Reports from "@/features/reports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/reports/")({
  component: () => (
    <ProtectedRoute requiredPermission="reports">
      <Reports />
    </ProtectedRoute>
  ),
});
