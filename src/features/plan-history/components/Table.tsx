import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { PlanHistory } from "../type/type";
import { columns } from "./columns";

interface PlanHistoryTableProps {
  data: PlanHistory[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  pageSize?: number;
}

const PlanHistoryTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  pageSize,
}: PlanHistoryTableProps) => {
  return (
    <div className="-mx-4 -mt-2 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        defaultPageSize={pageSize}
        key={"planHistory"}
      />
    </div>
  );
};

export default PlanHistoryTable;
