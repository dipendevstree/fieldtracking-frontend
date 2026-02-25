import { useGetAllPendingLeaveEncashmentRequest } from "@/features/leave-management/services/leave-request.hook";
import PendingLeaveEncashmentTable from "./pending-leave-encashment-request-table";
import LeaveEncashmentRequestViewDialog from "./LeaveEncashmentRequestViewDialog";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";

interface Props {
  pagination: {
    page: number;
    limit: number;
    selfView?: boolean;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  dashboardView?: boolean;
}

export default function PendingLeaveEncashmentRequest({
  pagination,
  onPaginationChange,
  dashboardView,
}: Props) {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveRequestStore();
  const {
    data: leaveEncashmentRequestList,
    isLoading,
    totalCount,
  } = useGetAllPendingLeaveEncashmentRequest(pagination);

  return (
    <>
      {open === "view-leave-encashment" && currentRow && (
        <LeaveEncashmentRequestViewDialog
          open={open === "view-leave-encashment"}
          onClose={() => {
            setOpen(null);
            setCurrentRow(null);
          }}
          currentRow={currentRow}
        />
      )}
      <PendingLeaveEncashmentTable
        key={"pending-leave-encashment-request-table"}
        data={leaveEncashmentRequestList}
        totalCount={totalCount || 0}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
        dashboardView={dashboardView}
      />
    </>
  );
}
