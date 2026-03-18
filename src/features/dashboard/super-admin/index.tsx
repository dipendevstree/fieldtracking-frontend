import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { useAuth } from "@/stores/use-auth-store";
import { Navigate } from "@tanstack/react-router";
import { TopStatsCard } from "@/components/ui/TopStatsCard";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  // Redirect non-super admins
  if (!user?.isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Super Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          System-wide management and monitoring for FieldTrack platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <TopStatsCard
          title="Trial Plan Organizations"
          value={0}
          description="Organizations on trial plan"
          icon={Shield}
          href={{
            to: "/superadmin/organizations",
          }}
        />

        <TopStatsCard
          title="Paid Plan Organizations"
          value={0}
          description="Organizations on paid plan"
          icon={Shield}
          href={{
            to: "/superadmin/organizations",
          }}
        />

        <TopStatsCard
          title="Expiring Plans"
          value={0}
          description="Organizations with expiring plans"
          icon={Shield}
          href={{
            to: "/superadmin/organizations",
          }}
        />
      </div>
    </Main>
  );
}
