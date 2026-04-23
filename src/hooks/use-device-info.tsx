import { DeviceInfo, getDeviceInfo } from "@/utils/commonFunction";
import { useEffect, useState } from "react";

/**
 * React hook to retrieve device information.
 */
export function useDeviceInfo() {
  const [device, setDevice] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    getDeviceInfo().then(setDevice);
  }, []);

  return device;
}
