import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus } from "lucide-react";
import { useState } from "react";
import HolidayTypeTable from "./components/holiday-type-table";
import HolidayTypeActionModal from "./components/holiday-type-action-modal";

import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useHolidayTypeStore } from "../../store/holiday-type.store";
import { useGetAllHolidayTypes } from "../../services/holiday-type.action.hook";
import { Main } from "@/components/layout/main";

export default function HolidayTypeManagement() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const {
    data: holidayTypes = [],
    totalCount = 0,
    isLoading,
  } = useGetAllHolidayTypes({
    page: pagination.page,
    limit: pagination.limit,
  });

  const { setOpen } = useHolidayTypeStore();

  const openAddDialog = () => {
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className="space-y-6">
      {/* Header Stats - Simplified for now as we don't have separate stats API for holiday types yet */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Holiday Types Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Holiday Types
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configured Holiday Types Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configured Holiday Types</h3>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Holiday Type
          </Button>
          <HolidayTypeActionModal />
        </div>

        <HolidayTypeTable
          data={holidayTypes}
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
