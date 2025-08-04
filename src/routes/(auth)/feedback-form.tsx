// Your route file (e.g., feedback-form/index.tsx)
import { createFileRoute } from "@tanstack/react-router";
import FeedbackForm from "@/features/Feedback-form/Feedback-form";

export const Route = createFileRoute("/(auth)/feedback-form")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      token: String(search.token ?? ""), // Ensure token is always a string
      schema: String(search.schemaName ?? ""), // Ensure token is always a string
    };
  },
});

function RouteComponent() {
  return <FeedbackForm />;
}
