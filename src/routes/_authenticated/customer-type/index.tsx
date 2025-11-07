import CustomerType from "@/features/customer-type";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/customer-type/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="customer_type">
      <CustomerType />
    </ProtectedRoute>
  );
}
