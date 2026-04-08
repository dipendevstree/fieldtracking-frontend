import { useGetAllLeaveApprovalHistory } from "@/features/leave-management/services/leave-request.hook";
import LeaveApprovalTable from "./leave-approval-table";
import { useAuthStore } from "@/stores/use-auth-store";

interface Props {
  pagination: {
    page: number;
    limit: number;
    selfView?: boolean;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  dashboardView?: boolean;
}

export default function LeaveApprovalHistory({
  pagination,
  onPaginationChange,
  dashboardView,
}: Props) {
  const { user } = useAuthStore();
  const {
    data: leaveApprovalHistoryList,
    isLoading,
    totalCount,
  } = useGetAllLeaveApprovalHistory({ ...pagination, actionBy: user?.id });

  return (
    <>
      <LeaveApprovalTable
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
