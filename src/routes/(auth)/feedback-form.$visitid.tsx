import { createFileRoute } from "@tanstack/react-router";
import FeedbackForm from "@/features/Feedback-form/Feedback-form";

export const Route = createFileRoute("/(auth)/feedback-form/$visitid")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FeedbackForm />;
}
