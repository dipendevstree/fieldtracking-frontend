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
    <div className="relative flex min-h-svh flex-col lg:grid lg:grid-cols-2 lg:px-0">
      <SignInLeftSection />
      <div className="flex items-center justify-center p-4 md:p-8">
        <SignInSection />
      </div>
    </div>
  );
}
