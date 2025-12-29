import HolidayManagementPage from "@/features/holiday-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/holiday-management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HolidayManagementPage />;
}
