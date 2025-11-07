import { createFileRoute } from "@tanstack/react-router";
import AllUsers from "@/features/UserManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/users/")({
  component: () => (
    <ProtectedRoute requiredPermission="User_Management">
      <AllUsers />
    </ProtectedRoute>
  ),
});
