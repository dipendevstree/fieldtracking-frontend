import StatusBadge from "@/components/shared/common-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import moment from "moment";

interface UserDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  isWeb: boolean;
  lastActive: string;
}
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginData: {
    user: {
      id: string;
      schemaName: string;
      timeZone: string;
    };
    userDevices: UserDevice[] | null;
  };
}

export default function UserDeviceModal({
  open,
  onOpenChange,
  loginData,
}: Props) {
  const MAX_DEVICE_LIMIT = 1;
  const handleLogoutDevice = (userDevice: UserDevice) => {};

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
            You've reached the maximum number of active devices. Please log out
            from one of your active devices to continue.
          </p>
          <div className="border p-4 rounded bg-gray-100">
            <h3 className="font-semibold mb-2">Active Devices</h3>
            <div className="space-y-2 mt-2">
              {loginData?.userDevices?.map((device: any) => (
                <div
                  key={device.id}
                  className={`p-2 border rounded-sm border-2 ${device.isActive ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        Device: {device.isWeb ? "Web Browser" : "Mobile"}{" "}
                        <StatusBadge
                          status={device.isActive ? "Active" : "Inactive"}
                        />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last active:{" "}
                        {moment
                          .tz(device.lastActive, loginData.user.timeZone)
                          .format("DD MMM YYYY, h:mm A")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleLogoutDevice(device)}>
                      <LogOut size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button disabled={loginData?.userDevices?.length !== MAX_DEVICE_LIMIT}>Continue</Button>
      </DialogContent>
    </Dialog>
  );
}
