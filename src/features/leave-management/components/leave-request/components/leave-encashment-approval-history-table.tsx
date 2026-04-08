import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import leaveEncashmentApprovalHistoryColumns from "./leave-encashment-approval-history-table-columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
  dashboardView?: boolean;
}

const LeaveEncashmentApprovalHistoryTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
  dashboardView,
}: Props) => {
  const navigate = useNavigate();

  const table = (
    <CustomDataTable
      paginationCallbacks={paginationCallbacks}
      loading={loading}
      data={data}
      currentPage={currentPage}
      columns={leaveEncashmentApprovalHistoryColumns as ColumnDef<unknown>[]}
      totalCount={totalCount}
      key={"leave-encashment-approval-history"}
      defaultPageSize={defaultPageSize}
    />
  );

  if (dashboardView) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leave Encashment Approval History</CardTitle>
            </div>
            <Button
              onClick={() =>
                navigate({ to: "/leave-management/leave-request" })
              }
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>{table}</CardContent>
      </Card>
    );
  }

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0">
      {table}
    </div>
  );
};

export default LeaveEncashmentApprovalHistoryTable;
