import { createFileRoute } from "@tanstack/react-router";
import CalendarPage from "@/features/calendar";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/calendar/")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="calender_view">
      <CalendarPage />
    </ProtectedRoute>
  );
}
