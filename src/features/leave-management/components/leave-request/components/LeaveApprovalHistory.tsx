import { useGetAllLeaveApprovalHistory } from "@/features/leave-management/services/leave-request.hook";
import LeaveApprovalTable from "./leave-approval-table";
import { useAuthStore } from "@/stores/use-auth-store";

interface Props {
  pagination: {
    page: number;
    limit: number;
  };
  onPaginationChange: (page: number, pageSize: number) => void;
}

export default function LeaveApprovalHistory({
  pagination,
  onPaginationChange,
}: Props) {
  const { user } = useAuthStore();
  const { data: leaveApprovalHistoryList, isLoading } =
    useGetAllLeaveApprovalHistory({ ...pagination, actionBy: user?.id });

  return (
    <>
      <LeaveApprovalTable
        data={leaveApprovalHistoryList}
        totalCount={leaveApprovalHistoryList?.length || 0}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
      />
    </>
  );
}
