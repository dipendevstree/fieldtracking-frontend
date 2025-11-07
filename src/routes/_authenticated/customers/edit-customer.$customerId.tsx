import AddCustomerPage from "@/features/customers/components/add-customer";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/customers/edit-customer/$customerId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PermissionGate
      requiredPermission="customer_directory"
      action="edit"
      fallback={<Navigate to="/403" replace />}
    >
      <AddCustomerPage />
    </PermissionGate>
  );
}
