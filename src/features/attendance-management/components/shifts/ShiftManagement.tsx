import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useGetAllShifts } from "@/features/attendance-management/services/shift.action.hook";

import { useShiftStore } from "../../store/shift.store";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { Main } from "@/components/layout/main";
import ShiftActionModal from "./components/shift-action-modal";
import ShiftTable from "./components/shift-table";

export default function ShiftManagement() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const {
    data: shifts = [],
    totalCount = 0,
    isLoading,
  } = useGetAllShifts({
    page: pagination.page,
    limit: pagination.limit,
  });

  const { setOpen } = useShiftStore();

  const openAddDialog = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, pageSize }));
  };

  return (
    <Main className="space-y-6">
      {/* Configured Shifts Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configured Shifts</h3>
          {/* <PermissionGate requiredPermission="shifts" action="add"> */}
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Shift
          </Button>
          {/* </PermissionGate> */}
          <ShiftActionModal />
        </div>

        <ShiftTable
          data={shifts}
          totalCount={totalCount}
          loading={isLoading}
          currentPage={pagination.page}
          paginationCallbacks={{ onPaginationChange }}
          defaultPageSize={pagination.limit}
        />
      </div>
    </Main>
  );
}
