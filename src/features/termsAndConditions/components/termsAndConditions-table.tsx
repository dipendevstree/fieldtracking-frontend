import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { TermsAndConditions } from "../types";
import { termsColumns } from "./termsAndConditions.columns";

interface TermsTableProps {
  data: TermsAndConditions[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number
}

const TermsTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize
}: TermsTableProps) => {
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={termsColumns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"terms-and-conditions"}
        defaultPageSize={defaultPageSize}
      />
    </div>
  );
};

export default TermsTable;