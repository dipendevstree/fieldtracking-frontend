import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { columns } from "./columns";
import { useAuthStore } from "@/stores/use-auth-store";

interface UserTableProps {
  data: any[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
  pageSize?: number;
  hideActions?: boolean;
}

const AllUsersTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  pageSize,
  hideActions = false,
}: UserTableProps) => {
  const { user } = useAuthStore();
  const allowTerritoryFilter =
    user?.organization?.allowAddUsersBasedOnTerritories;
  const filteredColumns = columns.filter((column: any) => {
    if (hideActions && column.id === "actions") return false;
    if (!allowTerritoryFilter && column.accessorKey === "territory")
      return false;
    return true;
  });

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={filteredColumns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        defaultPageSize={pageSize}
        key={"users"}
      />
    </div>
  );
};

export default AllUsersTable;
