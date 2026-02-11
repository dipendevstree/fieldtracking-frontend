import StatusBadge from "@/components/shared/common-status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginData: {
    user: {
      id: string;
      schemaName: string;
    };
    userDevices: {
      id: string;
      deviceName: string;
      lastActive: string;
    }[] | null;
  };
}

export default function UserDeviceModal({ open, onOpenChange, loginData }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] !max-w-md overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>Maximum Device Limit Reached</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">
            You've reached the maximum number of active devices. Please log out from one of your active devices to continue.
          </p>
          <div className="bg-muted p-4 rounded">
            <h3 className="font-semibold">Active Devices</h3>
            <div className="space-y-2 mt-2">
              {loginData?.userDevices?.map((device: any) => (
                <div key={device.id} className="p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Device: {device.isWeb ? "Web" : "Mobile"} <StatusBadge status={device.isActive ? "Active" : "Inactive"} /></p>
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(device.lastActive).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Log Out
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button>Continue</Button>
      </DialogContent>
    </Dialog>
  );
}
