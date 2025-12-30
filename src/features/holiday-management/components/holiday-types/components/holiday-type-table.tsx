import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { holidayTypeColumns } from "./holiday-type-columns";

interface Props {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
}

const HolidayTypeTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
}: Props) => {
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={holidayTypeColumns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"holiday-types"}
        defaultPageSize={defaultPageSize}
      />
    </div>
  );
};

export default HolidayTypeTable;
