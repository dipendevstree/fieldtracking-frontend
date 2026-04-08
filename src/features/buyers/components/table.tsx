import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { columns } from "../../organizations/components/columns";
import { User } from "../types";

interface UserTableProps {
  data: User[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  pageSize?: number;
}

const MerchantTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  pageSize,
}: UserTableProps) => {
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        defaultPageSize={pageSize}
        key={"users"}
      />
    </div>
  );
};

export default MerchantTable;
