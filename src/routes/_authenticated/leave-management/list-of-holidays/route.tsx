import HolidayManagement from "@/features/holiday-management/components/holiday/HolidayManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/leave-management/list-of-holidays"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="list_of_holidays">
      <HolidayManagement />
    </ProtectedRoute>
  );
}
