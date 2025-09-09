import { Button } from "@/components/ui/button";
import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";
import { Shield, Download } from "lucide-react";
import { useAuth } from "@/stores/use-auth-store";

// // Define valid tab values for super admin dashboard
export type SuperAdminTabValue =
  | "/super-admin/organizations"

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  // Redirect non-super admins
  if (!user?.isSuperAdmin) {
    return (
      <Main className={cn("flex flex-col items-center justify-center p-8")}>
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the Super Admin Dashboard.
          </p>
        </div>
      </Main>
    );
  }

  const handleExportSystemReport = () => {
    // TODO: Implement system-wide report export functionality
    console.log('Exporting system report...');
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Super Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            System-wide management and monitoring for FieldTrack platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportSystemReport}>
            <Download className="h-4 w-4 mr-2" />
            Export System Report
          </Button>
        </div>
      </div>
    </Main>
  );
}
