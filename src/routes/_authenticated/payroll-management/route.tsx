import { createFileRoute } from "@tanstack/react-router";
import PayrollPage from "@/features/payroll-management/components/PayrollPage";

export const Route = createFileRoute("/_authenticated/payroll-management")({
  component: PayrollPage,
});
