import StatusBadge from "@/components/shared/common-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useLogoutDevice } from "../services/sign-in-services";

interface UserDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  isActive: boolean;
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
  login: () => void;
}

export default function UserDeviceModal({
  open,
  onOpenChange,
  loginData,
  login,
}: Props) {
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<UserDevice | null>();

  const { mutate: logoutFromOtherDevice } = useLogoutDevice(
    selectedDevice?.id || "",
    () => {
      setUserDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === selectedDevice?.id) {
            return { ...device, isActive: false };
          }
          return device;
        }),
      );
    },
  );

  useEffect(() => {
    setUserDevices(loginData?.userDevices || []);
    return () => {
      setUserDevices([]);
    };
  }, [loginData]);

  const MAX_DEVICE_LIMIT = userDevices?.length;
  const activeDevicesCount = userDevices?.filter(
    (device: UserDevice) => device.isActive,
  ).length;

  const handleLogoutDevice = (userDevice: UserDevice) => {
    setSelectedDevice(userDevice);
    logoutFromOtherDevice({
      deviceId: userDevice.deviceId,
      userId: userDevice.userId,
      isWeb: userDevice.isWeb,
      schemaName: loginData.user.schemaName,
    });
  };

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
              {userDevices.length > 0 &&
                userDevices?.map((device: any) => (
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
                          {device.lastActiveAt
                            ? moment
                                .tz(device.lastActiveAt,loginData.user.timeZone)
                                .format("DD MMM YYYY, h:mm A")
                            : "N/A"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!device.isActive}
                        onClick={() => handleLogoutDevice(device)}
                      >
                        <LogOut size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Button
          disabled={activeDevicesCount >= MAX_DEVICE_LIMIT}
          onClick={() => login()}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
