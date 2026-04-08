import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { leaveApprovalColumns } from "./leave-approval-table-columns";
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

const LeaveApprovalTable = ({
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
      columns={leaveApprovalColumns as ColumnDef<unknown>[]}
      totalCount={totalCount}
      key={"leave-approval"}
      defaultPageSize={defaultPageSize}
    />
  );

  if (dashboardView) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Approval History</CardTitle>
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

export default LeaveApprovalTable;
