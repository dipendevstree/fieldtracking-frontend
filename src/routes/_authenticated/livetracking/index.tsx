import { createFileRoute } from "@tanstack/react-router";
import Livetracking from "@/features/livetracking";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/livetracking/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="live_tracking">
      <Livetracking />
    </ProtectedRoute>
  );
}
