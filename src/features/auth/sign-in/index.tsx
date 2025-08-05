import { useAuthStore } from "@/stores/use-auth-store";
import { Navigate } from "@tanstack/react-router";
import SignInLeftSection from "./components/sign-in-left-section";
import SignInSection from "./components/sign-in-section";

export default function SignIn() {
  const { isAuthenticated, isPasswordChanged } = useAuthStore();

  if (isAuthenticated && isPasswordChanged) {
    return <Navigate to="/" />;
  }
  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <SignInLeftSection />
      <SignInSection />
    </div>
  );
}
