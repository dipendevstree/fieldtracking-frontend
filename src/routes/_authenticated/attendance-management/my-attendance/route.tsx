import MyAttendance from "@/features/attendance-management/components/attendance";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/my-attendance"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="my-attendance">
      <MyAttendance />
    </ProtectedRoute>
  );
}
