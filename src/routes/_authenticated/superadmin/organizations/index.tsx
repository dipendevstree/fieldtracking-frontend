import { createFileRoute } from "@tanstack/react-router";
import Organizations from "@/features/organizations";

export const Route = createFileRoute(
  "/_authenticated/superadmin/organizations/",
)({
  validateSearch: (search: Record<string, unknown>) => ({
    planStatus: (search.planStatus as string) ?? "",
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    // <ProtectedRoute requiredPermission='organizations'>
    // </ProtectedRoute>
    <Organizations />
  );
}
