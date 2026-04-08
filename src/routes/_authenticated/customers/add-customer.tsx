import { createFileRoute, Navigate } from "@tanstack/react-router";
import AddCustomerPage from "../../../features/customers/components/add-customer";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export const Route = createFileRoute("/_authenticated/customers/add-customer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PermissionGate requiredPermission="customer_directory" action="add" fallback={<Navigate to="/403" replace />}>
      <AddCustomerPage />
    </PermissionGate>
  );
}
