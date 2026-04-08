import { ResetPasswordForm } from "@/features/auth/forgot-password/components/reset-password-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResetPasswordForm />;
}
