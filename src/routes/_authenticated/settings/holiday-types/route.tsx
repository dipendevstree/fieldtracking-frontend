import { createFileRoute } from "@tanstack/react-router";
import HolidayTypeManagement from "@/features/holiday-management/components/holiday-types/HolidayTypeManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/settings/holiday-types")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="holiday_types">
      <HolidayTypeManagement />
    </ProtectedRoute>
  );
}
