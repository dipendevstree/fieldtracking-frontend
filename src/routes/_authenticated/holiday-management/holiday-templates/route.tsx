import { createFileRoute } from "@tanstack/react-router";
import HolidayCalendarTemplates from "@/features/holiday-management/components/holiday-templates/HolidayTemplates";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute(
  "/_authenticated/holiday-management/holiday-templates"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="holiday_templates">
      <HolidayCalendarTemplates />
    </ProtectedRoute>
  );
}
