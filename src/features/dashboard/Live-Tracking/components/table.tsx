import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { LiveTrackingUser, LiveTrackingStats } from "../type/type";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import { useLiveTrackingStore } from "../store/live-tracking.store";
import { LiveTrackingActionModal } from "./action-form-modal";

interface LiveTrackingTableProps {
  data: LiveTrackingUser[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  stats?: LiveTrackingStats;
}

const LiveTrackingTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: LiveTrackingTableProps) => {
  const { setOpen } = useLiveTrackingStore();

  const handleViewMap = () => {
    setOpen("settings");
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleViewMap}
          className="flex items-center gap-1"
          disabled={loading}
        >
          <MapIcon className="h-4 w-4" />
          View Map
        </Button>
      </div>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"liveTracking"}
      />
      <LiveTrackingActionModal key={"live-tracking-action-modal"} />
    </div>
  );
};

export default LiveTrackingTable;
