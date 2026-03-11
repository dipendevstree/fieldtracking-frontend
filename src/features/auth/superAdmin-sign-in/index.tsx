import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/use-auth-store";
import SignInLeftSection from "./components/superAdmin-sign-in-left-section";
import SignInSection from "./components/superAdmin-sign-in-section";

export default function SuperAdminSignIn() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
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
