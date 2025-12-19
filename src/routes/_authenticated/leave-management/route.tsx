import LeaveManagementPage from "@/features/leave-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/leave-management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LeaveManagementPage />;
}
