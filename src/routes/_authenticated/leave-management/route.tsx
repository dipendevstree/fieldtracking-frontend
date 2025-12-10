import { createFileRoute } from "@tanstack/react-router";
import LeaveManagementPage from "@/features/leave-management/components/LeaveManagementPage";

export const Route = createFileRoute("/_authenticated/leave-management")({
  component: LeaveManagementPage,
});
