import { useGetAllLeaveRequest } from "@/features/leave-management/services/leave-request.hook";
import PendingLeaveTable from "./pending-leave-table";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import LeaveRequestViewDialog from "./LeaveRequestViewDialog";

interface Props {
  pagination: {
    page: number;
    limit: number;
    selfView?: boolean;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  dashboardView?: boolean;
}

export default function PendingRequest({
  pagination,
  onPaginationChange,
  dashboardView,
}: Props) {
  const { open, setOpen, currentRow } = useLeaveRequestStore();
  const { data: leaveRequestList, isLoading } =
    useGetAllLeaveRequest(pagination);

  return (
    <>
      {open === "view" && (
        <LeaveRequestViewDialog
          open={open === "view"}
          onClose={() => setOpen(null)}
          currentRow={currentRow}
        />
      )}
      <PendingLeaveTable
        data={leaveRequestList}
        totalCount={leaveRequestList?.length || 0}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
        dashboardView={dashboardView}
      />
    </>
  );
}
