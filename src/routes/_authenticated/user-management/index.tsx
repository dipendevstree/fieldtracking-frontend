import { createFileRoute } from "@tanstack/react-router";
import AllUsers from "@/features/UserManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/user-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="User_Management">
      <AllUsers />
    </ProtectedRoute>
  );
}
