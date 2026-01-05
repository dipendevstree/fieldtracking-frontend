import ShiftManagement from "@/features/attendance-management/components/shifts/ShiftManagement";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/shifts"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <ShiftManagement />;
}
