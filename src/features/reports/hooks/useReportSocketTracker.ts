import { useEffect, useCallback } from "react";
import { socketForVisit } from "@/socket/socket";
import { useAuth } from "@/stores/use-auth-store";

/**
 * Custom hook to track reports via socket and handle auto-download.
 *
 * @param onReportGenerated - Optional callback to update local UI state
 */
export const useReportSocketTracker = (
  onReportGenerated?: (data: any) => void
) => {
  const { user } = useAuth();

  // --- Common download function ---
  const triggerFileDownload = useCallback((url: string) => {
    if (!url) return;
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "report";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error triggering file download:", err);
    }
  }, []);

  // --- Handle report event ---
  const handleReportGenerated = useCallback(
    (data: any) => {
      if (!data) return;

      // update state in parent component if callback provided
      if (onReportGenerated) onReportGenerated(data);

      // auto-download file if available
      if (data?.fileUrl) triggerFileDownload(data.fileUrl);
    },
    [onReportGenerated, triggerFileDownload]
  );

  // --- Setup socket ---
  useEffect(() => {
    if (!user?.access_token || !user?.organizationID) return;

    const socket = socketForVisit(user.access_token);
    if (!socket) return;

    const orgId = user.organizationID;

    const handleConnect = () => {
      socket.emit("track_reports", { organizationId: orgId });
    };

    socket.on("connect", handleConnect);
    socket.on("report_generated", handleReportGenerated);

    return () => {
      socket.emit("untrack_reports", { organizationId: orgId });
      socket.off("connect", handleConnect);
      socket.off("report_generated", handleReportGenerated);
      socket.disconnect();
    };
  }, [user?.access_token, user?.organizationID, handleReportGenerated]);
};
