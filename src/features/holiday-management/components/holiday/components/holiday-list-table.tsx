import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { holidayListColumns } from "./holiday-table-columns";

interface Props {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
}

const HolidayListTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
}: Props) => {
  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={holidayListColumns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"pending-leave"}
        defaultPageSize={defaultPageSize}
      />
    </div>
  );
};

export default HolidayListTable;
