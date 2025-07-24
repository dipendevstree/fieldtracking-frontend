import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { Category } from "@/features/approvals/type/type";
import { categoryExpansesColumns } from "./expenses-category-columns";

interface CategoryTableProps {
  data: Category[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
}

const CategoryTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: CategoryTableProps) => {
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={categoryExpansesColumns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"categories"}
      />
    </div>
  );
};

export default CategoryTable;
