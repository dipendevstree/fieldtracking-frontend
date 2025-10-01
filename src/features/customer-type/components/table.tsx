import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination";
import { CustomerType } from "../type/type";
import { columns } from "./columns";
import { CustomerTypeActionModal } from "./action-form-modal";

interface CustomerTypeTableProps {
  data: CustomerType[];
  totalCount: number;
  loading?: boolean;
  paginationCallbacks: PaginationCallbacks;
  currentPage?: number;
}

const CustomerTypeTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: CustomerTypeTableProps) => {
  return (
    <div className="-mx-4 -mt-2 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={"customerType"}
      />
      <CustomerTypeActionModal key={"CustomerType-action-modal"} />
    </div>
  );
};

export default CustomerTypeTable;
