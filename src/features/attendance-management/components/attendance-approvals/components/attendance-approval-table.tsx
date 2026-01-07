import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { createColumns } from "./columns";
interface AttendanceApprovalTableProps {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
}

const AttendanceApprovalTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
}: AttendanceApprovalTableProps) => {
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={createColumns() as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"attendance-approval"}
        defaultPageSize={defaultPageSize}
      />
    </div>
  );
};

export default AttendanceApprovalTable;
