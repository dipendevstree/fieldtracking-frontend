import PerformanceReport from "@/features/reports/performance-reports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/reports/performance")({
  component: PerformanceReport,
});
