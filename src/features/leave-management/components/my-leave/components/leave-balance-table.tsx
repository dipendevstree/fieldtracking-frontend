import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { leaveBalanceColumns } from "./leave-balance-table-columns";

interface Props {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
}

const LeaveBalanceTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
}: Props) => {
  return (
    <CustomDataTable
      paginationCallbacks={paginationCallbacks}
      loading={loading}
      data={data}
      currentPage={currentPage}
      columns={leaveBalanceColumns as ColumnDef<unknown>[]}
      totalCount={totalCount}
      key={"leave-approval"}
      defaultPageSize={defaultPageSize}
    />
  );
};

export default LeaveBalanceTable;
