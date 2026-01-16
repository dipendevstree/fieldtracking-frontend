import MyLeave from "@/features/leave-management/components/my-leave/MyLeave";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/leave-management/my-leave"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="my_leave">
      <MyLeave />
    </ProtectedRoute>
  );
}
