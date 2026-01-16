import { useGetAllLeaveBalanceHistory } from "@/features/leave-management/services/leave-request.hook";
import { useAuthStore } from "@/stores/use-auth-store";
import LeaveBalanceHistoryTable from "./leave-balance-history-table";

interface Props {
  pagination: {
    page: number;
    limit: number;
    selfView?: boolean;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
  dashboardView?: boolean;
}

export default function LeaveBalanceHistory({
  pagination,
  onPaginationChange,
  dashboardView,
}: Props) {
  const { user } = useAuthStore();
  const {
    data: leaveBalanceHistoryList,
    isLoading,
    totalCount,
  } = useGetAllLeaveBalanceHistory({ ...pagination, userId: user?.id });

  return (
    <>
      <LeaveBalanceHistoryTable
        key={"leave-balance-history-table"}
        data={leaveBalanceHistoryList}
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
