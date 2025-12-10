import { createFileRoute } from "@tanstack/react-router";
import AttendancePage from "@/features/attendance-management/components/AttendancePage";

export const Route = createFileRoute("/_authenticated/attendance-management")({
  component: AttendancePage,
});
