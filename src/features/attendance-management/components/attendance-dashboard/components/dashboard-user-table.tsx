import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { dashboardUserColumns } from "./dashboard-user-columns";
import { dashboardUserColumnsWeeklyMonthly } from "./dashboard-user-columns-weekly-monthly";

interface Props {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  defaultPageSize?: number;
  viewType?: "daily" | "range";
}

const DashboardUserTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
  viewType = "daily",
}: Props) => {
  const columns =
    viewType === "daily"
      ? dashboardUserColumns
      : dashboardUserColumnsWeeklyMonthly;

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={`dashboard-users-${viewType}`}
        defaultPageSize={defaultPageSize}
      />
    </div>
  );
};

export default DashboardUserTable;
