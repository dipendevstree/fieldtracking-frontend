import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { dashboardUserColumns } from "./dashboard-user-columns";
import { dashboardUserColumnsWeeklyMonthly } from "./dashboard-user-columns-weekly-monthly";
import { DashboardUserTableProps } from "@/features/attendance-management/types";

const DashboardUserTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
  viewType = "daily",
}: DashboardUserTableProps) => {
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
