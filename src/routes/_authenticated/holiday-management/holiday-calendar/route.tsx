import { createFileRoute } from "@tanstack/react-router";
import HolidayManagement from "@/features/holiday-management/components/holiday/HolidayManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute(
  "/_authenticated/holiday-management/holiday-calendar"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="holiday_calendar">
      <HolidayManagement />
    </ProtectedRoute>
  );
}
