import MyAttendance from "@/features/attendance-management/components/attendance";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/attendance-calendar"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <MyAttendance />;
}
