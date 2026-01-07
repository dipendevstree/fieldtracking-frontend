import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import CustomReports from "@/features/reports/components/custom-reports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/reports/custom-reports/")(
  {
    component: () => (
      <ProtectedRoute requiredPermission="reports">
        <CustomReports />
      </ProtectedRoute>
    ),
  }
);
