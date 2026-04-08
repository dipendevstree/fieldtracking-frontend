import { useGetAllLeaveEncashmentApprovalHistory } from "@/features/leave-management/services/leave-request.hook";
import { useAuthStore } from "@/stores/use-auth-store";
import LeaveEncashmentApprovalHistoryTable from "./leave-encashment-approval-history-table";

interface Props {
  pagination: {
    page: number;
    limit: number;
    selfView?: boolean;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  dashboardView?: boolean;
}

export default function LeaveEncashmentApprovalHistory({
  pagination,
  onPaginationChange,
  dashboardView,
}: Props) {
  const { user } = useAuthStore();
  const {
    data: leaveApprovalHistoryList,
    isLoading,
    totalCount,
  } = useGetAllLeaveEncashmentApprovalHistory({
    ...pagination,
    actionBy: user?.id,
  });

  return (
    <>
      <LeaveEncashmentApprovalHistoryTable
        key={"leave-approval-table"}
        data={leaveApprovalHistoryList}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
        dashboardView={dashboardView}
      />
    </>
  );
}
