import { createFileRoute } from "@tanstack/react-router";
import { CustomerDirectoryPage } from "../../../features/customers/components/CustomerDirectoryPage";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/customers/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="customer_directory">
      <CustomerDirectoryPage />
    </ProtectedRoute>
  );
}
