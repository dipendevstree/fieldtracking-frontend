import TermsAndConditionsPage from "@/features/termsAndConditions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/termsAndConditions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TermsAndConditionsPage />;
}
